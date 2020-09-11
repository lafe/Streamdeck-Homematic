import { Device } from "../data/Device";

export async function loadDevices(homematicIp: string): Promise<Device[]> {
    return [
        { name: "Lorem" },
        { name: "Ipsum" }
    ];
}