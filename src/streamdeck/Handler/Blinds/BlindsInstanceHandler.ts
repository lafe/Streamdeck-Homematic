import { getLogger, Logger } from "../../../common/Logger";
import { BlindsSettings } from "../../../data/settings/BlindsSettings";
import { setBlindsHeight } from "../../../homematic/setBlindsHeight";
import { KeyDownMessage } from "../../../message/KeyDownMessage";
import { StreamDeck } from "../../StreamDeck";
import { BaseStreamDeckInstanceHandler } from "../BaseStreamDeckInstanceHandler";

export class BlindsInstanceHandler extends BaseStreamDeckInstanceHandler<BlindsSettings> {
    protected logger: Logger;
    // private mode: "TEMPERATURE" | "HUMIDITY" = "TEMPERATURE";

    // private refreshInterval = 30000;
    // private timerHandle?: number;
    // private displayCanvas!: HTMLCanvasElement;

    constructor(streamdeck: StreamDeck, device: string | undefined, context: string | undefined, initialSettings: BlindsSettings | undefined) {
        super(streamdeck, device, context, initialSettings);

        this.logger = getLogger(`BlindsInstanceHandler-${device}-${context}`);
        // this.createCanvas();
        // this.refresh();
    }

    // protected startTimer() {
    //     if (this.timerHandle != null) {
    //         this.stopTimer();
    //     }
    //     this.timerHandle = window.setInterval(() => {
    //         this.refresh();
    //     }, this.refreshInterval);
    //     this.logger.info(`Started new timer with handle ${this.timerHandle} and interval ${this.refreshInterval}`);
    // }

    // protected stopTimer() {
    //     if (this.timerHandle != null) {
    //         this.logger.info(`Stopping timer ${this.timerHandle}`);
    //         window.clearInterval(this.timerHandle);
    //     }
    // }

    // protected async refresh() {
    //     try {
    //         this.logger.log("Refresh event triggered");
    //         this.stopTimer();

    //         if (this.settings == null) {
    //             this.logger.error("Settings are empty. Cannot refresh data from HomeMatic.");
    //             return;
    //         }
    //         if (this.settings.selectedDeviceId == null) {
    //             this.logger.error("No blinds control device configured. Cannot refresh data from HomeMatic.");
    //             return;
    //         }

    //         const device = await loadState(this.settings.address, this.settings.selectedDeviceId);
    //         if (device == null) {
    //             this.logger.warn(`Could not load state data for device ${this.settings.selectedDeviceId}`);
    //             return;
    //         }
    //         const data = filterDataPoints(device, ["TEMPERATURE", "HUMIDITY"]);
    //         const modeData = data.filter(dataPoint => dataPoint.type === this.mode);
    //         if (modeData.length === 0) {
    //             this.logger.error(`No data points found for mode ${this.mode}`);
    //             return;
    //         }
    //         this.renderButton(modeData[0]);

    //     } catch (e) {
    //         this.logger.error("While handling the refresh, an error occurred", e);
    //     } finally {
    //         this.startTimer();
    //     }
    // }

    // protected createCanvas() {
    //     this.displayCanvas = document.createElement("canvas");
    //     this.displayCanvas.width = 144;
    //     this.displayCanvas.height = 144;

    // }

    // protected renderButton(modeData: DataPoint) {
    //     if (this.streamdeck == null) {
    //         this.logger.error("StreamDeck instance is empty. Cannot render button");
    //         return;
    //     }
    //     if (this.context == null) {
    //         this.logger.error("The context of the current button is unknown. Cannot rendr it.");
    //         return;
    //     }
    //     let nummericValue = Number(modeData.value);
    //     nummericValue = Math.round(nummericValue * 10) / 10;
    //     const value = `${nummericValue}${modeData.valueUnit}`;
    //     this.logger.info(`Rendering new value of ${value}`);

    //     const drawContext = this.displayCanvas.getContext("2d");
    //     if (drawContext == null) {
    //         this.logger.error("Draw Context for canvas is null. Cannot output value.");
    //         return;
    //     }
    //     drawContext.clearRect(0, 0, this.displayCanvas.width, this.displayCanvas.height);
    //     drawContext.font = "bold 50px verdana, sans-serif ";
    //     drawContext.textAlign = "center";
    //     drawContext.textBaseline = "middle";
    //     drawContext.fillStyle = "#ffffff";
    //     drawContext.fillText(value, this.displayCanvas.width / 2, this.displayCanvas.height / 2, this.displayCanvas.width - 50);

    //     this.streamdeck.setImage(this.context, this.displayCanvas.toDataURL());
    // }

    public onKeyDown(instance: StreamDeck, message: KeyDownMessage<BlindsSettings>) {
        const settings = message.payload.settings;
        this.logger.info(`KeyDown for relay "${settings.selectedDeviceName}".`);

        setBlindsHeight(instance, this.settings);
    }

    // /**
    //  * Triggered when settings changed
    //  * 
    //  * @param instance The StreamDeck instance that sent this message
    //  * @param message The raw message that has been sent
    //  */
    // public onSettings(instance: StreamDeck, message: ReceiveSettingsMessage<BlindsSettings>) {
    //     super.onSettings(instance, message);

    //     this.refresh();
    // }
}