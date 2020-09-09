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
    // window.$SD.api = Object.assign({ send: SDApi.send }, SDApi.common, SDApi[inMessageType]);
    console.log("Hello World");
    console.log("Localized Strings", $localizedStrings);
    console.log("Remote Settings", REMOTESETTINGS);
    console.log("isQt", isQT);
    console.log("debug", debug);
    console.log("debug log", debugLog);
    console.log("MIMAGECACHE", MIMAGECACHE);
    // eslint-disable-next-line prefer-rest-params
    StreamDeck.getInstance()
        .connect(inPort, inUUID, inMessageType, inApplicationInfo, inActionInfo);
}


/* legacy support */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function connectSocket(inPort: string, inUUID: string, inMessageType: string, inApplicationInfo: string, inActionInfo: string) {
    connectElgatoStreamDeckSocket(inPort, inUUID, inMessageType, inApplicationInfo, inActionInfo);
}