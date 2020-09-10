import { BaseMessage } from "./BaseMessage";
export interface SystemDidWakeUpMessage extends BaseMessage {
    event: "systemDidWakeUp";
}
