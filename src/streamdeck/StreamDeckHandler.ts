import { v4 as uuidv4 } from "uuid";
import { assertNever } from "../common/assertNever";
import { getLogger, Logger } from "../common/Logger";
import { ApplicationDidLaunchMessage } from "../message/ApplicationDidLaunchMessage";
import { ApplicationDidTerminateMessage } from "../message/ApplicationDidTerminateMessage";
import { BaseActionMessage } from "../message/BaseActionMessage";
import { BaseMessage } from "../message/BaseMessage";
import { ConnectMessage } from "../message/ConnectMessage";
import { DisconnectMessage } from "../message/DisconnectMessage";
import { KeyDownMessage } from "../message/KeyDownMessage";
import { KeyUpMessage } from "../message/KeyUpMessage";
import { PropertyInspectorDidAppearMessage } from "../message/PropertyInspectorDidAppearMessage";
import { PropertyInspectorDidDisappearMessage } from "../message/PropertyInspectorDidDisappearMessage";
import { ReceiveGlobalSettingsMessage } from "../message/ReceiveGlobalSettingsMessage";
import { ReceiveSettingsMessage } from "../message/ReceiveSettingsMessage";
import { SendToPluginMessage } from "../message/SendToPluginMessage";
import { SendToPropertyInspectorMessage } from "../message/SendToPropertyInspectorMessage";
import { SystemDidWakeUpMessage } from "../message/SystemDidWakeUpMessage";
import { TitleParametersDidChangeMessage } from "../message/TitleParametersDidChangeMessage";
import { WillAppearMessage } from "../message/WillAppearMessage";
import { WillDisappearMessage } from "../message/WillDisappearMessage";
import { BaseStreamDeckHandler } from "./Handler/BaseStreamDeckHandler";
import { RelayHandler } from "./Handler/RelayHandler";
import { StreamDeck } from "./StreamDeck";

export class StreamDeckHandler {
    private streamdeck: StreamDeck;
    private messageHandlerId: string;
    private messageHandlers: BaseStreamDeckHandler<unknown>[] = [];

    private logger: Logger = getLogger("StreamDeckHandler");

    constructor(streamdeck: StreamDeck) {
        this.streamdeck = streamdeck;

        this.messageHandlers.push(new RelayHandler());

        this.messageHandlerId = `StreamDeckHandler-${uuidv4()}`;
        this.streamdeck.registerHandler(this.messageHandlerId, (instance, message) => this.handleNewMessage(instance, message));
    }

    protected handleNewMessage(instance: StreamDeck, message: BaseMessage) {
        for (const messageHandler of this.messageHandlers) {
            this.handleMessage(messageHandler, instance, message);
        }
    }

    protected handleMessage(messageHandler: BaseStreamDeckHandler<unknown>, instance: StreamDeck, message: BaseMessage) {
        messageHandler.onHandleRawMessage(instance, message);

        switch (message.event) {
            case "didReceiveSettings":
                this.triggerEvent<ReceiveSettingsMessage<unknown>>(messageHandler, "onSettings", instance, message);
                break;
            case "didReceiveGlobalSettings":
                this.triggerEvent<ReceiveGlobalSettingsMessage<unknown>>(messageHandler, "onGlobalSettings", instance, message);
                break;
            case "keyDown":
                this.triggerEvent<KeyDownMessage<unknown>>(messageHandler, "onKeyDown", instance, message);
                break;
            case "keyUp":
                this.triggerEvent<KeyUpMessage<unknown>>(messageHandler, "onKeyUp", instance, message);
                break;
            case "willAppear":
                this.triggerEvent<WillAppearMessage<unknown>>(messageHandler, "onWillAppear", instance, message);
                break;
            case "willDisappear":
                this.triggerEvent<WillDisappearMessage<unknown>>(messageHandler, "onWillDisappear", instance, message);
                break;
            case "titleParametersDidChange":
                this.triggerEvent<TitleParametersDidChangeMessage<unknown>>(messageHandler, "onTitleParametersDidChange", instance, message);
                break;
            case "deviceDidConnect":
                this.triggerEvent<ConnectMessage>(messageHandler, "onDeviceDidConnect", instance, message);
                break;
            case "deviceDidDisconnect":
                this.triggerEvent<DisconnectMessage>(messageHandler, "onDeviceDidConnect", instance, message);
                break;
            case "applicationDidLaunch":
                this.triggerEvent<ApplicationDidLaunchMessage>(messageHandler, "onApplicationDidLaunch", instance, message);
                break;
            case "applicationDidTerminate":
                this.triggerEvent<ApplicationDidTerminateMessage>(messageHandler, "onApplicationDidTerminate", instance, message);
                break;
            case "systemDidWakeUp":
                this.triggerEvent<SystemDidWakeUpMessage>(messageHandler, "onSystemDidWakeUp", instance, message);
                break;
            case "propertyInspectorDidAppear":
                this.triggerEvent<PropertyInspectorDidAppearMessage>(messageHandler, "onPropertyInspectorDidAppear", instance, message);
                break;
            case "propertyInspectorDidDisappear":
                this.triggerEvent<PropertyInspectorDidDisappearMessage>(messageHandler, "onPropertyInspectorDidDisappear", instance, message);
                break;
            case "sendToPlugin":
                this.triggerEvent<SendToPluginMessage<unknown>>(messageHandler, "onSendToPlugin", instance, message);
                break;
            case "sendToPropertyInspector":
                this.triggerEvent<SendToPropertyInspectorMessage<unknown>>(messageHandler, "onSendToPropertyInspector", instance, message);
                break;
            default:
                assertNever(message.event, true);
        }
    }

    protected triggerEvent<TMessageType extends BaseMessage>(messageHandler: BaseStreamDeckHandler<unknown>, event: FunctionPropertyNames<BaseStreamDeckHandler<unknown>>, instance: StreamDeck, message: BaseMessage) {
        const specificMessage = message as TMessageType;
        const actionMessage = message as BaseActionMessage;
        if(actionMessage.action != null && actionMessage.action !== messageHandler.action){
            this.logger.log(`Action of message (${actionMessage.action}) is not supported by handler for action "${messageHandler.action}"`);
            return;
        }

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        messageHandler[event](instance, specificMessage as any);
    }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type FunctionPropertyNames<T> = { [K in keyof T]: T[K] extends ((instance: any, message: any) => any) ? K : never }[keyof T];