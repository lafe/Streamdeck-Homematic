import { getLogger } from "../common/Logger";
import { Device } from "../data/Device";
import { convertChannel } from "./convertChannel";

export function convertDevice(xmlDevice: Element): Device | null {
    try {
        if (xmlDevice.getAttribute == null || xmlDevice == null) {
            return null;
        }
        const device: Device = {
            name: xmlDevice.getAttribute("name") ?? "",
            address: xmlDevice.getAttribute("address") ?? "",
            id: xmlDevice.getAttribute("ise_id") ?? "",
            interface: xmlDevice.getAttribute("interface") ?? "BidCos-RF",
            deviceType: xmlDevice.getAttribute("device_type") ?? "",
            readyConfig: Boolean(xmlDevice.getAttribute("readyConfig") ?? false),
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