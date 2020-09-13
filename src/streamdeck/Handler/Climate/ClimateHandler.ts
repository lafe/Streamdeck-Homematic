import { getLogger, Logger } from "../../../common/Logger";
import { RelaySettings } from "../../../data/settings/RelaySettings";
import { StreamDeck } from "../../StreamDeck";
import { StreamDeckPluginAction } from "../../StreamDeckPluginAction";
import { BaseStreamDeckHandler } from "../BaseStreamDeckHandler";
import { ClimateInstanceHandler } from "./ClimateInstanceHandler";

export class ClimateHandler extends BaseStreamDeckHandler<RelaySettings, ClimateInstanceHandler> {
    public action: StreamDeckPluginAction;
    protected logger: Logger;

    constructor() {
        super();
        this.action = StreamDeckPluginAction.ClimateDisplay;
        this.logger = getLogger("ClimateHandler");
    }

    public createInstanceHandler(streamdeck: StreamDeck, device: string | undefined, context: string | undefined, initialSettings: RelaySettings | undefined) {
        return new ClimateInstanceHandler(streamdeck, device, context, initialSettings);
    }
}