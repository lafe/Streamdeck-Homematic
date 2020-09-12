import { getLogger } from "../common/Logger";
import { DataPoint } from "../data/DataPoint";

export function convertDataPoint(parentId: string, dataPointNode: Element): DataPoint | null{
    try {
        const dataPoint: DataPoint = {
            name: dataPointNode.getAttribute("name") ?? "",
            type: dataPointNode.getAttribute("type") ?? "",
            id: dataPointNode.getAttribute("ise_id") ?? "",
            parentChannelId: parentId,
            value: dataPointNode.getAttribute("value") ?? "",
            valueType: Number(dataPointNode.getAttribute("valuetype") ?? ""),
            valueUnit: dataPointNode.getAttribute("valueunit") ?? "",
            timestamp: Number(dataPointNode.getAttribute("timestamp") ?? ""),
            operations: Number(dataPointNode.getAttribute("operations") ?? ""),
        };

        return dataPoint;
    }
    catch (e) {
        const logger = getLogger("convertDataPoint");
        logger.error("An error occurred whily trying to convert the datapoint", dataPointNode, e);
        return null;
    }
}


