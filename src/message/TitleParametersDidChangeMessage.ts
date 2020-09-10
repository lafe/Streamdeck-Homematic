import { Coordinate } from "../data/Coordinate";
import { TitleDefinition } from "../data/TitleDefinition";
import { BaseActionMessage } from "./BaseActionMessage";
export interface TitleParametersDidChangeMessage<TSettings> extends BaseActionMessage {
    event: "titleParametersDidChange";
    payload: {
        coordinates: Coordinate;
        settings: TSettings;
        state: number;
        title: string;
        titleParameters: TitleDefinition;
    };
}
