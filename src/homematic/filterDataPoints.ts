import { DataPoint } from "../data/DataPoint";
import { DataPointType } from "../data/DataPointType";
import { Device } from "../data/Device";

export function filterDataPoints(device: Device, dataPointType: DataPointType[]): DataPoint[] {
    const result: DataPoint[] = [];

    for (const channel of device.channels) {
        for (const dataPoint of channel.datapoints) {
            if (dataPointType.includes(dataPoint.type as DataPointType)) {
                result.push(dataPoint);
            }
        }
    }

    return result;
}