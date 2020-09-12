import { getLogger, Logger } from "../../common/Logger";
import { RelaySettings } from "../../data/settings/RelaySettings";
import { KeyDownMessage } from "../../message/KeyDownMessage";
import { StreamDeck } from "../StreamDeck";
import { StreamDeckPluginAction } from "../StreamDeckPluginAction";
import { BaseStreamDeckHandler } from "./BaseStreamDeckHandler";

export class RelayHandler extends BaseStreamDeckHandler<RelaySettings> {
    public action: StreamDeckPluginAction;
    protected logger: Logger;

    constructor() {
        super();
        this.action = StreamDeckPluginAction.RelayToggle;
        this.logger = getLogger("RelayHandler");
    }

    public onKeyDown(instance: StreamDeck, message: KeyDownMessage<RelaySettings>) {
        const settings = message.payload.settings;
        this.logger.info(`KeyDown for relay "${settings.selectedDeviceName}"`);
    }
}