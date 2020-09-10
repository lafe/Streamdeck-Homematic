import { BaseActionMessage } from "./BaseActionMessage";
import { BasePayload } from "./BasePayload";
export interface WillDisappearMessage<TSettings> extends BaseActionMessage {
    event: "willDisappear";
    payload: BasePayload<TSettings> & {
        state: number;
    };
}
