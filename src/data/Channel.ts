import { DataPoint } from "./DataPoint";

export interface Channel {
    name: string;
    type: number;
    address:string;
    id:string;
    direction:string;
    parentDeviceId:string;
    index:number;
    visible:boolean;
    datapoints: DataPoint[];
}