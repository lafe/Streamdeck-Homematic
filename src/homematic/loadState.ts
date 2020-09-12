import { getLogger } from "../common/Logger";
import { Device } from "../data/Device";
import { buildUrl } from "./buildUrl";
import { convertDevice } from "./convertDevice";

/**
 * Returns the current state of a given device
 * 
 * @param homematicAddress The address of the HomeMatic CCU
 * @param deviceId The ID of the device for which the state is needed
 */
export async function loadState(homematicAddress: string, deviceId: string) {
    const logger = getLogger("LoadState");
    const url = buildUrl(homematicAddress, "state", { "device_id": deviceId });
    logger.log(`Loading state for device ${deviceId} from ${url}`);

    const rawResult = await fetch(url);
    if (!rawResult.ok) {
        logger.error(`An error occurred whily trying to load the state for device ${deviceId} from HomeMatic CCU ${homematicAddress}: ${rawResult.status} - ${rawResult.statusText}`);
        return null;
    }
    const textResult = await rawResult.text();

    // logger.log("Converting result in XML", textResult);
    const parser = new DOMParser();
    const result = parser.parseFromString(textResult, "text/xml") as XMLDocument;
    logger.log("Retrieved XML result", result);

    const devicesXpathResult = result.evaluate("//device", result.getRootNode(), null, XPathResult.ANY_TYPE, null);

    const devices: Device[] = [];
    let xmlDevice: Node | null;
    do {
        xmlDevice = devicesXpathResult.iterateNext();
        if (xmlDevice == null) {
            continue;
        }
        const device = convertDevice(xmlDevice as Element);
        if (device != null) {
            devices.push(device);
        }
    } while (xmlDevice != null);

    logger.log("Retrieved device information", devices);

    if(devices.length >1){
        logger.warn(`More than one device with ID ${deviceId} found. Returning first device`);
    }
    return devices[0];
}