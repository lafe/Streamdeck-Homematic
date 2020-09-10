import { BaseActionMessage } from "./BaseActionMessage";
import { BasePayload } from "./BasePayload";
export interface KeyUpMessage<TSettings> extends BaseActionMessage {
    event: "keyUp";
    payload: BasePayload<TSettings> & {
        state: number;
        userDesiredState: number;
    };
}
