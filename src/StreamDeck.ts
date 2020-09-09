import { getWebSocketError } from "./common/getWebSocketError";
import "./extensions/WebSocketExtensions";

export class StreamDeck {
    private static instance: StreamDeck;
    public static getInstance(): StreamDeck {
        if (StreamDeck.instance == null) {
            StreamDeck.instance = new StreamDeck();
        }
        return StreamDeck.instance;
    }

    public inPort?: string;
    public inUUID?: string;
    public inMessageType?: string;
    public inApplicationInfo?: string;
    public inActionInfo?: string;
    private websocket?: WebSocket;

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
        if (debug) {
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

        this.websocket.onopen = () => {
            const json = {
                event: inMessageType,
                uuid: inUUID
            };

            console.log("***************", inMessageType + "  websocket:onopen", inUUID, json);

            if (this.websocket == null) {
                return;
            }

            this.websocket.sendJSON(json);
            // $SD.uuid = inUUID;
            // $SD.actionInfo = inActionInfo;
            // $SD.applicationInfo = inApplicationInfo;
            // $SD.messageType = inMessageType;
            // $SD.connection = websocket;

            // instance.emit('connected', {
            //     connection: websocket,
            //     port: inPort,
            //     uuid: inUUID,
            //     actionInfo: inActionInfo,
            //     applicationInfo: inApplicationInfo,
            //     messageType: inMessageType
            // });
        };

        this.websocket.onerror = (evt) => {
            console.warn("WEBOCKET ERROR", evt);
        };

        this.websocket.onclose = (evt) => {
            // Websocket is closed
            const reason = getWebSocketError(evt);
            console.warn("[STREAMDECK]***** WEBOCKET CLOSED **** reason:", reason);
        };

        this.websocket.onmessage = (evt) => {
            console.log("New message", evt);
            // const jsonObj = Utils.parseJson(evt.data);
            // let m;

            // // console.log('[STREAMDECK] websocket.onmessage ... ', jsonObj.event, jsonObj);

            // if (!jsonObj.hasOwnProperty("action")) {
            //     m = jsonObj.event;
            //     // console.log('%c%s', 'color: white; background: red; font-size: 12px;', '[common.js]onmessage:', m);
            // } else {
            //     switch (inMessageType) {
            //         case "registerPlugin":
            //             m = jsonObj["action"] + "." + jsonObj["event"];
            //             break;
            //         case "registerPropertyInspector":
            //             m = "sendToPropertyInspector";
            //             break;
            //         default:
            //             console.log(
            //                 "%c%s",
            //                 "color: white; background: red; font-size: 12px;",
            //                 "[STREAMDECK] websocket.onmessage +++++++++  PROBLEM ++++++++"
            //             );
            //             console.warn("UNREGISTERED MESSAGETYPE:", inMessageType);
            //     }
            // }

            // if (m && m !== "") events.emit(m, jsonObj);
        };
    }
}