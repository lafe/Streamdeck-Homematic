import { BaseMessage } from "./BaseMessage";
export interface ReceiveGlobalSettingsMessage<TSettings> extends BaseMessage {
    event: "didReceiveGlobalSettings";
    payload: {
        settings: TSettings;
    };
}
