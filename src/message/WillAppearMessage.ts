import { BaseActionMessage } from "./BaseActionMessage";
import { BasePayload } from "./BasePayload";
export interface WillAppearMessage<TSettings> extends BaseActionMessage {
    event: "willAppear";
    payload: BasePayload<TSettings> & {
        state: number;
    };
}
