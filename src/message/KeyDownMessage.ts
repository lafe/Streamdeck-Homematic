import { BaseActionMessage } from "./BaseActionMessage";
import { BasePayload } from "./BasePayload";
export interface KeyDownMessage<TSettings> extends BaseActionMessage {
    event: "keyDown";
    payload: BasePayload<TSettings> & {
        state: number;
        userDesiredState: number;
    };
}
