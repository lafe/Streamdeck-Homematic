import { BaseActionMessage } from "./BaseActionMessage";
export interface SendToPluginMessage<TPayload> extends BaseActionMessage {
    event: "sendToPlugin";
    payload: TPayload;
}
