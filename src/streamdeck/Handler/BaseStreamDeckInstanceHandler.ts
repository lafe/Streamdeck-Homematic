/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Logger } from "../../common/Logger";
import { ApplicationDidLaunchMessage } from "../../message/ApplicationDidLaunchMessage";
import { ApplicationDidTerminateMessage } from "../../message/ApplicationDidTerminateMessage";
import { BaseMessage } from "../../message/BaseMessage";
import { ConnectMessage } from "../../message/ConnectMessage";
import { DisconnectMessage } from "../../message/DisconnectMessage";
import { KeyDownMessage } from "../../message/KeyDownMessage";
import { KeyUpMessage } from "../../message/KeyUpMessage";
import { PropertyInspectorDidAppearMessage } from "../../message/PropertyInspectorDidAppearMessage";
import { PropertyInspectorDidDisappearMessage } from "../../message/PropertyInspectorDidDisappearMessage";
import { ReceiveGlobalSettingsMessage } from "../../message/ReceiveGlobalSettingsMessage";
import { ReceiveSettingsMessage } from "../../message/ReceiveSettingsMessage";
import { SendToPluginMessage } from "../../message/SendToPluginMessage";
import { SendToPropertyInspectorMessage } from "../../message/SendToPropertyInspectorMessage";
import { SystemDidWakeUpMessage } from "../../message/SystemDidWakeUpMessage";
import { TitleParametersDidChangeMessage } from "../../message/TitleParametersDidChangeMessage";
import { WillAppearMessage } from "../../message/WillAppearMessage";
import { WillDisappearMessage } from "../../message/WillDisappearMessage";
import { StreamDeck } from "../StreamDeck";

/**
 * Handles a specifc instance (aka key) on the StreamDeck
 */
export abstract class BaseStreamDeckInstanceHandler<TSettings> {
    protected abstract logger: Logger;

    public streamdeck: StreamDeck;
    public device?: string;
    public context?: string;
    public settings?: TSettings;

    constructor(streamdeck: StreamDeck, device: string | undefined, context: string | undefined, initialSettings: TSettings|undefined) {
        this.streamdeck =streamdeck;
        this.device = device;
        this.context = context;
        this.settings = initialSettings;
    }

    /**
     * Receives the raw message from StreamDeck. This method is triggered before any other, 
     * more specialised methods are executed.
     * 
     * @param instance The StreamDeck instance that sent this message
     * @param message The raw message that has been sent
     */
    public onHandleRawMessage(instance: StreamDeck, message: BaseMessage) {
     
    }
    
    /**
     * Triggered when settings changed
     * 
     * @param instance The StreamDeck instance that sent this message
     * @param message The raw message that has been sent
     */
    public onSettings(instance: StreamDeck, message: ReceiveSettingsMessage<TSettings>) {
        this.settings = message.payload.settings;
        this.logger.log("Updated settings", this.settings);
    }


    /**
     * Triggered when global settings changed
     * 
     * @param instance The StreamDeck instance that sent this message
     * @param message The raw message that has been sent
     */
    public onGlobalSettings(instance: StreamDeck, message: ReceiveGlobalSettingsMessage<TSettings>) {

    }

    /**
     * Triggered when the key on the StreamDeck has been pressed
     * 
     * @param instance The StreamDeck instance that sent this message
     * @param message The raw message that has been sent
     */
    public onKeyDown(instance: StreamDeck, message: KeyDownMessage<TSettings>) {

    }

    /**
     * Triggered when the key on the StreamDeck has been released
     * 
     * @param instance The StreamDeck instance that sent this message
     * @param message The raw message that has been sent
     */
    public onKeyUp(instance: StreamDeck, message: KeyUpMessage<TSettings>) {

    }

    /**
     * Triggered when the key on the StreamDeck appears. This is the initialization of an instance.
     * 
     * @param instance The StreamDeck instance that sent this message
     * @param message The raw message that has been sent
     */
    public onWillAppear(instance: StreamDeck, message: WillAppearMessage<TSettings>) {
        
    }

    /**
     * Triggered when the key on the StreamDeck disappears. This is the removal of an instance.
     * 
     * @param instance The StreamDeck instance that sent this message
     * @param message The raw message that has been sent
     */
    public onWillDisappear(instance: StreamDeck, message: WillDisappearMessage<TSettings>) {
       
    }

    
    public onTitleParametersDidChange(instance: StreamDeck, message: TitleParametersDidChangeMessage<TSettings>) {

    }

    public onDeviceDidConnect(instance: StreamDeck, message: ConnectMessage) {

    }

    public onDeviceDidDisconnect(instance: StreamDeck, message: DisconnectMessage) {

    }

    public onApplicationDidLaunch(instance: StreamDeck, message: ApplicationDidLaunchMessage) {

    }

    public onApplicationDidTerminate(instance: StreamDeck, message: ApplicationDidTerminateMessage) {

    }

    public onSystemDidWakeUp(instance: StreamDeck, message: SystemDidWakeUpMessage) {

    }

    public onPropertyInspectorDidAppear(instance: StreamDeck, message: PropertyInspectorDidAppearMessage) {

    }

    public onPropertyInspectorDidDisappear(instance: StreamDeck, message: PropertyInspectorDidDisappearMessage) {

    }

    public onSendToPlugin(instance: StreamDeck, message: SendToPluginMessage<unknown>) {

    }

    public onSendToPropertyInspector(instance: StreamDeck, message: SendToPropertyInspectorMessage<unknown>) {

    }

}