import { BaseActionMessage } from "./BaseActionMessage";
import { BasePayload } from "./BasePayload";

export interface ReceiveSettingsMessage<TSettings> extends BaseActionMessage {
    event: "didReceiveSettings";
    payload: BasePayload<TSettings>
}

