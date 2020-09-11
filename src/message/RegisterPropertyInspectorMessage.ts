import { Coordinate } from "../data/Coordinate";
import { BaseActionMessage } from "./BaseActionMessage";

/**
 * Message is sent to the property inspector on registration
 */
export interface RegisterPropertyInspectorMessage<TSettings> extends BaseActionMessage {
    payload: {
        coordinates: Coordinate;
        settings: TSettings;
    }
}