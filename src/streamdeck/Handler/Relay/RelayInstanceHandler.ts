import { getLogger, Logger } from "../../../common/Logger";
import { RelaySettings } from "../../../data/settings/RelaySettings";
import { toggleRelay } from "../../../homematic/toggleRelay";
import { KeyDownMessage } from "../../../message/KeyDownMessage";
import { StreamDeck } from "../../StreamDeck";
import { BaseStreamDeckInstanceHandler } from "../BaseStreamDeckInstanceHandler";

export class RelayInstanceHandler extends BaseStreamDeckInstanceHandler<RelaySettings> {
    protected logger: Logger;

    constructor(streamdeck: StreamDeck, device: string | undefined, context: string | undefined, initialSettings: RelaySettings | undefined) {
        super(streamdeck, device, context, initialSettings);

        this.logger = getLogger(`RelayInstanceHandler-${device}-${context}`);
    }

    public onKeyDown(instance: StreamDeck, message: KeyDownMessage<RelaySettings>) {
        const settings = message.payload.settings;
        this.logger.info(`KeyDown for relay "${settings.selectedDeviceName}".`);

        toggleRelay(instance, this.settings);
    }
}