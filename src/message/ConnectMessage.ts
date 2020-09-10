import { DeviceInfo } from "../data/DeviceInfo";
import { BaseMessage } from "./BaseMessage";

/**
 * Raised when a device connects to the computer
 * https://developer.elgato.com/documentation/stream-deck/sdk/events-received/#devicedidconnect
 */
export interface ConnectMessage extends BaseMessage{
    event: "deviceDidConnect";
    device: string;
    deviceInfo: DeviceInfo;
}


