import { Logger } from "../common/Logger";
import { StreamDeck } from "../common/StreamDeck";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
declare global {
    interface Window {
        connectElgatoStreamDeckSocket: (inPort: string, inUUID: string, inMessageType: string, inApplicationInfo: string, inActionInfo: string) => void;
        connectSocket: (inPort: string, inUUID: string, inMessageType: string, inApplicationInfo: string, inActionInfo: string) => void;
     }
}

/*
 * This is the first function StreamDeck Software calls, when establishing the connection to the plugin or the Property Inspector
 *
 * @param {string} inPort - The socket's port to communicate with StreamDeck software.
 * @param {string} inUUID - A unique identifier, which StreamDeck uses to communicate with the plugin
 * @param {string} inMessageType - Identifies, if the event is meant for the property inspector or the plugin.
 * @param {string} inApplicationInfo - Information about the host (StreamDeck) application
 * @param {string} inActionInfo - Context is an internal identifier used to communicate to the host application.
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function connectElgatoStreamDeckSocket(inPort: string, inUUID: string, inMessageType: string, inApplicationInfo: string, inActionInfo: string) {
    console.log("[RELAY] Connecting to Elgato Streamdeck");
    StreamDeck.getInstance()
        .connect(inPort, inUUID, inMessageType, inApplicationInfo, inActionInfo);
}

window.connectElgatoStreamDeckSocket = (inPort: string, inUUID: string, inMessageType: string, inApplicationInfo: string, inActionInfo: string) => connectElgatoStreamDeckSocket(inPort, inUUID, inMessageType, inApplicationInfo, inActionInfo);
/* legacy support */
window.connectSocket = (inPort: string, inUUID: string, inMessageType: string, inApplicationInfo: string, inActionInfo: string) => connectElgatoStreamDeckSocket(inPort, inUUID, inMessageType, inApplicationInfo, inActionInfo);

class RelayController {
    protected Logger: Logger;

    protected ipTextBox?: HTMLInputElement;

    constructor() {
        this.Logger = new Logger("RelayController");
    }

    public init() {
        this.Logger.log("Initializing Relay Controller");

        this.ipTextBox = document.getElementById("txtIp") as HTMLInputElement;
        this.ipTextBox.oninput = (ev) => this.onIpChange((ev.target as HTMLInputElement)?.value);
    }

    protected async onIpChange(newIp: string): Promise<void>{
        this.Logger.log(`Handling new IP ${newIp}`);
    }
}

(() => {
    const relayController = new RelayController();
    document.addEventListener("DOMContentLoaded", () => relayController.init());
})();