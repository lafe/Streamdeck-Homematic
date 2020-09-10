import { BaseMessage } from "./BaseMessage";

export interface BaseActionMessage extends BaseMessage {
    action: string;
    context: string;
    device?: string;
}