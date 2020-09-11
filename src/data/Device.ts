import { Channel } from "./Channel";

export interface Device {
    name: string;
    address: string;
    id: string;
    interface: string;
    deviceType: string;
    readyConfig: boolean;
    channels: Channel[];
}