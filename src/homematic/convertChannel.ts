import { getLogger } from "../common/Logger";
import { Channel } from "../data/Channel";
import { convertDataPoint } from "./convertDataPoint";

export function convertChannel(channelNode: Element): Channel | null {
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
            datapoints: []
        };

        const xmlChildNodes = channelNode.childNodes;
        for (let i = 0; i < xmlChildNodes.length; i++) {
            const xmlChildNode = xmlChildNodes[i] as Element;
            if (xmlChildNode.tagName !== "datapoint") {
                continue;
            }
            const datapoint = convertDataPoint(channel.id, xmlChildNode);
            if (datapoint != null) {
                channel.datapoints.push(datapoint);
            }
        }

        return channel;
    }
    catch (e) {
        const logger = getLogger("convertChannel");
        logger.error("An error occurred whily trying to convert the channel", channelNode, e);
        return null;
    }
}

