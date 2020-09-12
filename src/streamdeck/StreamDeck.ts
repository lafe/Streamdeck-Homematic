import { v4 as uuidv4 } from "uuid";
import { getWebSocketError } from "../common/getWebSocketError";
import { getLogger, Logger } from "../common/Logger";
import { parseJson } from "../common/parseJson";
import { Dictionary } from "../data/Dictionary";
import { BaseMessage } from "../message/BaseMessage";
import { ReceiveSettingsMessage } from "../message/ReceiveSettingsMessage";
import { RegisterPropertyInspectorMessage } from "../message/RegisterPropertyInspectorMessage";

export type StreamDeckIncomingMessageHandler = (instance: StreamDeck, message: BaseMessage) => void;
export enum ImageTarget {
    SoftwareAndHardware = 0,
    HardwareOnly = 1,
    SoftwareOnly = 2
}

export class StreamDeck {
    private static instance: StreamDeck;
    public static getInstance(): StreamDeck {
        if (StreamDeck.instance == null) {
            StreamDeck.instance = new StreamDeck();
        }
        return StreamDeck.instance;
    }

    protected incomingMessageHandlers: Dictionary<StreamDeckIncomingMessageHandler> = {};

    protected inPort?: string;
    protected inUUID?: string;
    protected inMessageType?: string;
    protected inApplicationInfo?: string;
    protected inActionInfo?: string;
    protected device?: string;
    protected context?: string;

    protected websocket?: WebSocket;
    protected Logger: Logger;
    public isConnected = false;

    constructor() {
        this.Logger = getLogger("StreamDeck");
    }

    public registerHandler(id: string, handler: StreamDeckIncomingMessageHandler) {
        this.incomingMessageHandlers[id] = handler;
    }
    public removeHandler(id: string) {
        delete this.incomingMessageHandlers[id];
    }

    protected showVars(): void {
        this.Logger.log("Connection variables:");
        this.Logger.log(`- Port: ${this.inPort}`);
        this.Logger.log(`- UUID: ${this.inUUID}`);
        this.Logger.log(`- Messagetype: ${this.inMessageType}`);
        this.Logger.log(`- Info: ${this.inApplicationInfo}`);
        this.Logger.log(`- InActionInfo: ${this.inActionInfo}`);
        this.Logger.log(`- Device: ${this.device}`);
        this.Logger.log(`- Context: ${this.context}`);
    }

    public connect(inPort: string, inUUID: string, inMessageType: string, inApplicationInfo: string, inActionInfo: string): void {
        this.inPort = inPort;
        this.inUUID = inUUID;
        this.inMessageType = inMessageType;
        this.inApplicationInfo = inApplicationInfo;
        this.inActionInfo = inActionInfo;

        if (this.inMessageType === "registerPropertyInspector" && this.inActionInfo != null) {
            const message = JSON.parse(this.inActionInfo) as RegisterPropertyInspectorMessage<unknown>;
            this.device = message.device;
            this.context = message.context;
        }

        this.showVars();

        // const lang = Utils.getProp(inApplicationInfo, "application.language", false);
        // if (lang) {
        //     loadLocalization(lang, inMessageType === "registerPropertyInspector" ? "../" : "./", function() {
        //         events.emit("localizationLoaded", { language: lang });
        //     });
        // }


        if (this.websocket != null) {
            this.websocket.close();
            this.websocket = undefined;
            this.isConnected = false;
        }

        this.websocket = new WebSocket("ws://127.0.0.1:" + inPort); //localhost

        this.websocket.onopen = () => this.websocketOnOpen();
        this.websocket.onerror = (evt) => this.websocketOnError(evt);
        this.websocket.onclose = (evt) => this.websocketOnClose(evt);
        this.websocket.onmessage = (evt) => this.websocketOnMessageReceived(evt);
        this.isConnected = true;
    }

    protected websocketOnOpen(): void {
        const json = {
            event: this.inMessageType,
            uuid: this.inUUID
        };

        this.Logger.log(`Opened WebSocket: ${this.inMessageType}`, this.inUUID, json);

        if (this.websocket == null) {
            return;
        }

        this.sendJson(json);
    }

    protected websocketOnError(evt: Event): void {
        this.Logger.warn("WEBOCKET ERROR", evt);
    }

    protected websocketOnClose(evt: CloseEvent): void {
        const reason = getWebSocketError(evt);
        this.Logger.warn(`WEBOCKET CLOSED. Reason: ${reason}`);
        this.isConnected = false;
    }

    protected websocketOnMessageReceived(evt: MessageEvent): void {
        const payloadMessage = parseJson<BaseMessage>(evt.data);

        if (payloadMessage == null) {
            this.Logger.log("Payload of received message is null");
            return;
        }

        this.Logger.log(`Received message ${payloadMessage.event}`, evt, payloadMessage);
        for (const incomingMessageHandlerId of Object.keys(this.incomingMessageHandlers)) {
            try {
                const incomingMessageHandler = this.incomingMessageHandlers[incomingMessageHandlerId];
                incomingMessageHandler(this, payloadMessage);
            } catch (e) {
                this.Logger.error(`While trying to invoke handler "${incomingMessageHandlerId}", an error occurred`, e);
            }
        }
    }

    private buildMessage<TPayload>(type: "setSettings" | "getSettings" | "logMessage" | "setImage", payload?: TPayload, context?: string) {
        const message: { event: string, context?: string, payload?: TPayload } = { event: type };
        message.context = context ?? this.inUUID;
        if (payload != null) {
            message.payload = payload;
        }
        return message;
    }

    public getSettings<TSettings>(): Promise<TSettings> {
        this.Logger.log("Retrieving settings");
        const promise = new Promise<TSettings>(resolve => {
            try {
                const handlerId = `internalGetSettingsHandler-${uuidv4()}`;
                const message = this.buildMessage("getSettings");

                const handleSettingsRetrieval = (streamDeck: StreamDeck, message: BaseMessage) => {
                    if (message.event !== "didReceiveSettings") {
                        return;
                    }
                    const settingsMessage = message as ReceiveSettingsMessage<TSettings>;
                    resolve(settingsMessage.payload.settings);
                    this.removeHandler(handlerId);
                };
                this.registerHandler(handlerId, handleSettingsRetrieval);
                this.sendJson(message);
            }
            catch (e) {
                this.Logger.error("While retrieving the settings, an error occurred", e);
            }
        });
        return promise;
    }

    public setSettings<TSettings>(settings: TSettings): void {
        this.Logger.log("Setting settings");
        const message = this.buildMessage("setSettings", settings);
        this.sendJson(message);
    }

    public setImage(context: string, image: string, target?: ImageTarget, state?: number): void {
        this.Logger.log("Setting image");
        const message = this.buildMessage("setImage", { image, target: target ?? ImageTarget.SoftwareAndHardware, state: state ?? 0 }, context);
        this.sendJson(message);
    }

    protected sendJson(data: unknown): void {
    if(this.websocket == null) {
    this.Logger.error("Cannot send paylod via websocket, because the websocket is null.", data);
    return;
}
if (data == null) {
    this.Logger.warn("Cannot send empty payload to Streamdeck");
    return;
}

const payload = JSON.stringify(data);
this.Logger.info("Sending data to Streamdeck", payload);
this.websocket.send(payload);
    }
}