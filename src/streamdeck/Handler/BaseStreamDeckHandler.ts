/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-empty-function */
import { Logger } from "../../common/Logger";
import { ApplicationDidLaunchMessage } from "../../message/ApplicationDidLaunchMessage";
import { ApplicationDidTerminateMessage } from "../../message/ApplicationDidTerminateMessage";
import { BaseActionMessage } from "../../message/BaseActionMessage";
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
import { StreamDeckPluginAction } from "../StreamDeckPluginAction";
import { BaseStreamDeckInstanceHandler } from "./BaseStreamDeckInstanceHandler";

export abstract class BaseStreamDeckHandler<TSettings, TInstanceHandler extends BaseStreamDeckInstanceHandler<TSettings>> {
    public abstract action: StreamDeckPluginAction;
    protected abstract logger: Logger;

    public instances: BaseStreamDeckInstanceHandler<TSettings>[] = [];

    constructor() {
    }

    /**
     * Creates a new instance of the application
     */
    public abstract createInstanceHandler(streamdeck: StreamDeck, device: string | undefined, context: string | undefined, initialSettings: TSettings | undefined): TInstanceHandler;

    /**
     * Receives the raw message from StreamDeck. This method is triggered before any other, 
     * more specialised methods are executed.
     * 
     * @param instance The StreamDeck instance that sent this message
     * @param message The raw message that has been sent
     */
    public onHandleRawMessage(instance: StreamDeck, message: BaseMessage) {
        this.sendToAll(handler => handler.onHandleRawMessage(instance, message));
    }

    /**
     * Triggered when settings changed
     * 
     * @param instance The StreamDeck instance that sent this message
     * @param message The raw message that has been sent
     */
    public onSettings(instance: StreamDeck, message: ReceiveSettingsMessage<TSettings>) {
        this.sendToContextInstance(message, handler => handler.onSettings(instance, message));
    }

    /**
     * Triggered when global settings changed
     * 
     * @param instance The StreamDeck instance that sent this message
     * @param message The raw message that has been sent
     */
    public onGlobalSettings(instance: StreamDeck, message: ReceiveGlobalSettingsMessage<TSettings>) {
        this.sendToAll(handler => handler.onGlobalSettings(instance, message));
    }

    /**
     * Triggered when the key on the StreamDeck has been pressed
     * 
     * @param instance The StreamDeck instance that sent this message
     * @param message The raw message that has been sent
     */
    public onKeyDown(instance: StreamDeck, message: KeyDownMessage<TSettings>) {
        this.sendToContextInstance(message, handler => handler.onKeyDown(instance, message));
    }

    /**
     * Triggered when the key on the StreamDeck has been released
     * 
     * @param instance The StreamDeck instance that sent this message
     * @param message The raw message that has been sent
     */
    public onKeyUp(instance: StreamDeck, message: KeyUpMessage<TSettings>) {
        this.sendToContextInstance(message, handler => handler.onKeyUp(instance, message));
    }

    /**
     * Triggered when the key on the StreamDeck appears. This is the initialization of an instance.
     * 
     * @param instance The StreamDeck instance that sent this message
     * @param message The raw message that has been sent
     */
    public onWillAppear(instance: StreamDeck, message: WillAppearMessage<TSettings>) {
        const newInstance = this.createInstanceHandler(instance, message.device, message.context, message.payload.settings);
        this.logger.log(`Created new instance for device "${message.device}" and context "${message.context}"`);
        this.instances.push(newInstance);
        newInstance.onHandleRawMessage(instance, message);
        newInstance.onWillAppear(instance, message);
    }

    /**
     * Triggered when the key on the StreamDeck disappears. This is the removal of an instance.
     * 
     * @param instance The StreamDeck instance that sent this message
     * @param message The raw message that has been sent
     */
    public onWillDisappear(instance: StreamDeck, message: WillDisappearMessage<TSettings>) {
        this.logInstances();
        let position = -1;
        this.logger.log(`Trying to delete instance for device ${message.device} and context ${message.context}`);
        do {
            position = this.instances.findIndex(instance => instance.context === message.context && instance.device === message.device);
            if (position === -1) {
                continue;
            }
            const instanceToBeDeleted = this.instances[position];
            this.logger.info(`Instance for device ${instanceToBeDeleted.device} and context ${instanceToBeDeleted.context} at position ${position} will be deleted`);
            instanceToBeDeleted.onWillDisappear(instance, message);
            this.instances.splice(position, 1);
        } while (position > -1);
        this.logInstances();
    }

    public onTitleParametersDidChange(instance: StreamDeck, message: TitleParametersDidChangeMessage<TSettings>) {
        this.sendToContextInstance(message, handler => handler.onTitleParametersDidChange(instance, message));
    }

    public onDeviceDidConnect(instance: StreamDeck, message: ConnectMessage) {
        this.sendToAll(handler => handler.onDeviceDidConnect(instance, message));
    }

    public onDeviceDidDisconnect(instance: StreamDeck, message: DisconnectMessage) {
        this.sendToAll(handler => handler.onDeviceDidDisconnect(instance, message));
    }

    public onApplicationDidLaunch(instance: StreamDeck, message: ApplicationDidLaunchMessage) {
        this.sendToAll(handler => handler.onApplicationDidLaunch(instance, message));
    }

    public onApplicationDidTerminate(instance: StreamDeck, message: ApplicationDidTerminateMessage) {
        this.sendToAll(handler => handler.onApplicationDidTerminate(instance, message));
    }

    public onSystemDidWakeUp(instance: StreamDeck, message: SystemDidWakeUpMessage) {
        this.sendToAll(handler => handler.onSystemDidWakeUp(instance, message));
    }

    public onPropertyInspectorDidAppear(instance: StreamDeck, message: PropertyInspectorDidAppearMessage) {
        this.sendToContextInstance(message, handler => handler.onPropertyInspectorDidAppear(instance, message));
    }

    public onPropertyInspectorDidDisappear(instance: StreamDeck, message: PropertyInspectorDidDisappearMessage) {
        this.sendToContextInstance(message, handler => handler.onPropertyInspectorDidDisappear(instance, message));
    }

    public onSendToPlugin(instance: StreamDeck, message: SendToPluginMessage<unknown>) {
        this.sendToContextInstance(message, handler => handler.onSendToPlugin(instance, message));
    }

    public onSendToPropertyInspector(instance: StreamDeck, message: SendToPropertyInspectorMessage<unknown>) {
        this.sendToContextInstance(message, handler => handler.onSendToPropertyInspector(instance, message));
    }

    /**
     * Message is sent to all registered instances
     */
    protected sendToAll(handler: (instance: BaseStreamDeckInstanceHandler<TSettings>) => void) {
        this.instances.forEach(instance => handler(instance));
    }

    /**
     * message is only send to correct instance with the same device and context
     */
    protected sendToContextInstance(message: BaseActionMessage, handler: (instance: BaseStreamDeckInstanceHandler<TSettings>) => void) {
        const filteredInstances = this.instances.filter(instance => instance.context === message.context && instance.device === message.device);
        filteredInstances.forEach(instance => handler(instance));
    }

    protected logInstances() {
        this.logger.log(`Currently ${this.instances.length} instance${(this.instances.length === 1 ? "" : "s")} are loaded`);
        for (let i = 0; i < this.instances.length; i++) {
            const instance = this.instances[i];
            this.logger.log(` ${i}: Device: ${instance.device} Context: ${instance.context}`);
        }
    }

}