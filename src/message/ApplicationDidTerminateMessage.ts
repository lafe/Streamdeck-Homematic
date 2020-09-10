import { BaseMessage } from "./BaseMessage";
export interface ApplicationDidTerminateMessage extends BaseMessage {
    event: "applicationDidTerminate";
    payload: {
        application: string;
    };
}
