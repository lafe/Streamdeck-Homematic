import { BaseMessage } from "./BaseMessage";

export interface DisconnectMessage extends BaseMessage {
    event: "deviceDidDisconnect";
    device: string;
}
