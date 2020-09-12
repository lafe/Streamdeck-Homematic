import { getLogger } from "../common/Logger";
import { Device } from "../data/Device";
import { buildUrl } from "./buildUrl";
import { convertDevice } from "./convertDevice";
import { DeviceType } from "./DeviceType";

export const supportedDevices = [DeviceType.Relay];

export async function loadDevices(homematicAddress: string): Promise<Device[]> {
    const logger = getLogger("LoadDevices");
    const url = buildUrl(homematicAddress, "devicelist");
    logger.log(`Loading device list from ${url}`);
    let rawResult: Response;
    try {
        rawResult = await fetch(url);
    } catch (e) {
        logger.error(`An error occurred while trying to load the devices from HomeMatic with URL ${homematicAddress}`, e);
        return [];
    }
    if (!rawResult.ok) {
        logger.error(`An error occurred while trying to load the devices from HomeMatic CCU ${homematicAddress}: ${rawResult.status} - ${rawResult.statusText}`);
        return [];
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

    logger.log("Retrieved all devices", devices);
    return devices;
}




