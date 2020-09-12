
export interface DataPoint {
    name: string;
    type: string;
    id: string;
    parentChannelId: string;
    value: string;
    valueType: number;
    valueUnit: string;
    timestamp: number;
    operations: number;
}
