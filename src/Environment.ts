/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-var */
var $localizedStrings: unknown = $localizedStrings || {};
var REMOTESETTINGS: any = REMOTESETTINGS || {};
var DestinationEnum = Object.freeze({
        HARDWARE_AND_SOFTWARE: 0,
        HARDWARE_ONLY: 1,
        SOFTWARE_ONLY: 2,
    });
var isQT = navigator.appVersion.includes("QtWebEngine");
var debug : any = debug ?? false;
// eslint-disable-next-line @typescript-eslint/no-empty-function
var debugLog: (messate: string, ...data: any[]) => void = function() {};
var MIMAGECACHE: any = MIMAGECACHE || {};

// eslint-disable-next-line @typescript-eslint/no-empty-function
const setDebugOutput = (debug: any) => (debug === true ? console.log.bind(window.console) : function() {});
debugLog = setDebugOutput(debug);