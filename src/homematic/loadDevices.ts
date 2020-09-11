import { getLogger } from "../common/Logger";
import { Channel } from "../data/Channel";
import { Device } from "../data/Device";
import { buildUrl } from "./buildUrl";
import { DeviceType } from "./DeviceType";

export const supportedDevices = [DeviceType.Relay];

export async function loadDevices(homematicIp: string): Promise<Device[]> {
    const logger = getLogger("LoadDevices");
    const url = buildUrl(homematicIp, "devicelist");
    logger.log(`Loading device list from ${url}`);
    const rawResult = await fetch(url);
    if (!rawResult.ok) {
        logger.error(`An error occurred whily trying to load the devices from the homematic device ${homematicIp}: ${rawResult.status} - ${rawResult.statusText}`);
        return [];
    }
    const textResult = await rawResult.text();

    logger.log("Converting result in XML", textResult);
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
        const device = convertDevice(xmlDevice);
        if (device != null) {
            devices.push(device);
        }
    } while (xmlDevice != null);

    logger.log("Retrieved all devices", devices);
    return devices;
}

function convertDevice(xmlDevice: Node): Device | null {
    try {
        const rawDevice = xmlDevice as Element;
        if (rawDevice.getAttribute == null || rawDevice == null) {
            return null;
        }
        const device: Device = {
            name: rawDevice.getAttribute("name") ?? "",
            address: rawDevice.getAttribute("address") ?? "",
            id: rawDevice.getAttribute("ise_id") ?? "",
            interface: rawDevice.getAttribute("interface") ?? "BidCos-RF",
            deviceType: rawDevice.getAttribute("device_type") ?? "",
            readyConfig: Boolean(rawDevice.getAttribute("readyConfig") ?? false),
            channels: []
        };

        const xmlChildNodes = xmlDevice.childNodes;
        for (let i = 0; i < xmlChildNodes.length; i++) {
            const xmlChildNode = xmlChildNodes[i] as Element;
            if (xmlChildNode.tagName !== "channel") {
                continue;
            }
            const channel = convertChannel(xmlChildNode);
            if (channel != null) {
                device.channels.push(channel);
            }
        }

        return device;
    }
    catch (e) {
        const logger = getLogger("convertDevice");
        logger.error("An error occurred whily trying to convert the device", xmlDevice, e);
        return null;
    }
}

function convertChannel(channelNode: Element): Channel | null {
    try {
        const channel: Channel = {
            name: channelNode.getAttribute("name") ?? "",
            type: Number(channelNode.getAttribute("type") ?? ""),
            address: channelNode.getAttribute("address") ?? "",
            id: channelNode.getAttribute("ise_id") ?? "",
            direction: channelNode.getAttribute("direction") ?? "",
            parentDeviceId: channelNode.getAttribute("parent_device") ?? "",
            index: Number(channelNode.getAttribute("index") ?? ""),
            visible: Boolean(channelNode.getAttribute("visible") ?? ""),
        };

        return channel;
    }
    catch (e) {
        const logger = getLogger("convertChannel");
        logger.error("An error occurred whily trying to convert the channel", channelNode, e);
        return null;
    }
}

