import { getLogger, Logger } from "../../../common/Logger";
import { RelaySettings } from "../../../data/settings/RelaySettings";
import { StreamDeck } from "../../StreamDeck";
import { StreamDeckPluginAction } from "../../StreamDeckPluginAction";
import { BaseStreamDeckHandler } from "../BaseStreamDeckHandler";
import { BlindsInstanceHandler } from "./BlindsInstanceHandler";

export class BlindsHandler extends BaseStreamDeckHandler<RelaySettings, BlindsInstanceHandler> {
    public action: StreamDeckPluginAction;
    protected logger: Logger;

    constructor() {
        super();
        this.action = StreamDeckPluginAction.BlindsControl;
        this.logger = getLogger("BlindsHandler");
    }

    public createInstanceHandler(streamdeck: StreamDeck, device: string | undefined, context: string | undefined, initialSettings: RelaySettings | undefined) {
        return new BlindsInstanceHandler(streamdeck, device, context, initialSettings);
    }
}