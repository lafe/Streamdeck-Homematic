import { BaseMessage } from "../message/BaseMessage";
import { debugLog } from "./debugLog";
import { getWebSocketError } from "./getWebSocketError";
import { Logger } from "./Logger";
import { parseJson } from "./parseJson";

export class StreamDeck {
    private static instance: StreamDeck;
    public static getInstance(): StreamDeck {
        if (StreamDeck.instance == null) {
            StreamDeck.instance = new StreamDeck();
        }
        return StreamDeck.instance;
    }

    public incomingMessage?: (instance: StreamDeck, message: BaseMessage) => void = undefined;

    protected inPort?: string;
    protected inUUID?: string;
    protected inMessageType?: string;
    protected inApplicationInfo?: string;
    protected inActionInfo?: string;
    protected websocket?: WebSocket;

    protected Logger: Logger;

    constructor() {
        this.Logger = new Logger("StreamDeck");
    }

    protected showVars(): void {
        debugLog("---- showVars");
        debugLog("- port", this.inPort);
        debugLog("- uuid", this.inUUID);
        debugLog("- messagetype", this.inMessageType);
        debugLog("- info", this.inApplicationInfo);
        debugLog("- inActionInfo", this.inActionInfo);
        debugLog("----< showVars");
    }

    public connect(inPort: string, inUUID: string, inMessageType: string, inApplicationInfo: string, inActionInfo: string): void {
        this.inPort = inPort;
        this.inUUID = inUUID;
        this.inMessageType = inMessageType;
        this.inApplicationInfo = inApplicationInfo;
        this.inActionInfo = inActionInfo;

        /** Debug variables */
        if (window.debug) {
            this.showVars();
        }

        // const lang = Utils.getProp(inApplicationInfo, "application.language", false);
        // if (lang) {
        //     loadLocalization(lang, inMessageType === "registerPropertyInspector" ? "../" : "./", function() {
        //         events.emit("localizationLoaded", { language: lang });
        //     });
        // }


        if (this.websocket != null) {
            this.websocket.close();
            this.websocket = undefined;
        }

        this.websocket = new WebSocket("ws://127.0.0.1:" + inPort); //localhost

        this.websocket.onopen = () => this.websocketOnOpen();
        this.websocket.onerror = (evt) => this.websocketOnError(evt);
        this.websocket.onclose = (evt) => this.websocketOnClose(evt);
        this.websocket.onmessage = (evt) => this.websocketOnMessageReceived(evt);
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
    }

    protected websocketOnMessageReceived(evt: MessageEvent): void {
        const payloadMessage = parseJson<BaseMessage>(evt.data);

        if (payloadMessage == null) {
            this.Logger.log("Payload of received message is null");
            return;
        }

        this.Logger.log(`Received message ${payloadMessage.event}`, evt, payloadMessage);
        if(this.incomingMessage == null){
            this.Logger.warn("Cannot process message, because handler is empty");
            return;
        }
        this.incomingMessage(this, payloadMessage);
    }

    public sendJson(data: unknown): void {
        if (this.websocket == null) {
            this.Logger.error("Cannot send paylod via websocket, because the websocket is null.", data);
            return;
        }
        const payload = JSON.stringify(data);
        this.Logger.info("Sending data to Streamdeck", payload);
        this.websocket.send(payload);
    }
}