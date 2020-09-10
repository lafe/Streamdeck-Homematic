import { BaseActionMessage } from "./BaseActionMessage";
export interface SendToPropertyInspectorMessage<TPayload> extends BaseActionMessage {
    event: "sendToPropertyInspector";
    payload: TPayload;
}
