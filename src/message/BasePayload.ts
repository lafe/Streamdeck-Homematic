import { Coordinate } from "../data/Coordinate";

export interface BasePayload<TSettings> {
    settings: TSettings;
    coordinates: Coordinate;
    isInMultiAction: boolean;
}