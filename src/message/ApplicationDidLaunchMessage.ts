import { BaseMessage } from "./BaseMessage";

export interface ApplicationDidLaunchMessage extends BaseMessage {
    event: "applicationDidLaunch";
    payload: {
        application: string;
    };
}
