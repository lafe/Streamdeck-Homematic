import { StreamDeck } from "./streamdeck/StreamDeck";
import { StreamDeckHandler } from "./streamdeck/StreamDeckHandler";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
declare global {
    interface Window {
        $localizedStrings: unknown;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        REMOTESETTINGS: any;
        debug: boolean;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        MIMAGECACHE: any;
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
    // console.log("Localized Strings", window.$localizedStrings);
    // console.log("Remote Settings", window.REMOTESETTINGS);
    // console.log("isQt", isQT);
    // console.log("debug", window.debug);
    // console.log("debug log", debugLog);
    // console.log("MIMAGECACHE", window.MIMAGECACHE);
    // eslint-disable-next-line prefer-rest-params
    const streamdeck = StreamDeck.getInstance();
    streamdeck.connect(inPort, inUUID, inMessageType, inApplicationInfo, inActionInfo);
    new StreamDeckHandler(streamdeck);
}

// /* eslint-disable @typescript-eslint/no-explicit-any */
// /* eslint-disable @typescript-eslint/no-unused-vars */
// /* eslint-disable no-var */
// window.$localizedStrings = window.$localizedStrings || {};
// window.REMOTESETTINGS = window.REMOTESETTINGS || {};
// var DestinationEnum = Object.freeze({
//         HARDWARE_AND_SOFTWARE: 0,
//         HARDWARE_ONLY: 1,
//         SOFTWARE_ONLY: 2,
//     });
// var isQT = navigator.appVersion.includes("QtWebEngine");
// window.debug = window.debug ?? false;
// // eslint-disable-next-line @typescript-eslint/no-empty-function
// var debugLog: (messate: string, ...data: any[]) => void = function() {};
// window.MIMAGECACHE = window.MIMAGECACHE || {};

// // eslint-disable-next-line @typescript-eslint/no-empty-function
// const setDebugOutput = (debug: any) => (debug === true ? console.log.bind(window.console) : function() {});
// debugLog = setDebugOutput(window.debug);


window.connectElgatoStreamDeckSocket = (inPort: string, inUUID: string, inMessageType: string, inApplicationInfo: string, inActionInfo: string) => connectElgatoStreamDeckSocket(inPort, inUUID, inMessageType, inApplicationInfo, inActionInfo);
/* legacy support */
window.connectSocket = (inPort: string, inUUID: string, inMessageType: string, inApplicationInfo: string, inActionInfo: string) => connectElgatoStreamDeckSocket(inPort, inUUID, inMessageType, inApplicationInfo, inActionInfo);