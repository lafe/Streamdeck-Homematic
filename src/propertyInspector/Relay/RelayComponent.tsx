import React, { useEffect, useState } from "react";
import { getLogger } from "../../common/Logger";
import { DropDown, DropDownOption } from "../../components/DropDown/DropDown";
import { PropertyInspectorContainer } from "../../components/PropertyInspectorContainer/PropertyInspectorContainer";
import { Spinner } from "../../components/Spinner/Spinner";
import { TextBox } from "../../components/TextBox/TextBox";
import { Device } from "../../data/Device";
import { RelaySettings } from "../../data/settings/RelaySettings";
import { DeviceType } from "../../homematic/DeviceType";
import { loadDevices } from "../../homematic/loadDevices";
import { useStreamDeck } from "../../streamdeck/React/useStreamDeck";
import { useStreamdeckConnected } from "../../streamdeck/React/useStreamdeckConnected";

export function RelayComponent() {
    const [isDevicesLoading, setIsDevicesLoading] = useState(false);
    const [devices, setDevices] = useState<Device[]>([]);
    const [settings, setSettings] = useState<RelaySettings | undefined>(undefined);
    const [isSettingsLoading, setIsSettingsLoading] = useState(false);

    const logger = getLogger("RelayComponent");
    const streamdeck = useStreamDeck();
    const streamdeckConnected = useStreamdeckConnected();

    useEffect(() => {
        let didCancel = false;
        async function fetchDevices() {
            setIsDevicesLoading(true);
            const fetchedDevices = settings?.address == null ? [] : await loadDevices(settings.address);
            if (!didCancel) {
                logger.log("Retrieved devices", fetchedDevices);
                setDevices(fetchedDevices);
                setIsDevicesLoading(false);
            }
        }
        fetchDevices();
        return () => { didCancel = true; };
    }, [settings?.address, logger]);

    useEffect(() => {
        let didCancel = false;
        async function loadSettings() {
            if (!streamdeck.isConnected) {
                return;
            }
            setIsSettingsLoading(true);
            const loadedSettings = await streamdeck.getSettings<RelaySettings>();
            if (!didCancel) {
                logger.log("Retrieved settings", loadedSettings);
                setSettings(loadedSettings);
                setIsSettingsLoading(false);
            }
        }

        if (settings == null) {
            logger.info("Settings empty. Loading settings.");
            if (!streamdeck.isConnected) {
                logger.warn("StreamDeck not yet connected");
            } else {
                loadSettings();
            }
        }

        return () => {
            didCancel = true;
        };
    }, [streamdeckConnected, logger, settings, streamdeck]);

    const onIpChange = async (newAddress?: string) => {
        logger.log(`Handling new address ${newAddress}`);
        const newSettings = settings == null ? {} as RelaySettings : { ...settings };
        newSettings.address = newAddress ?? "";
        streamdeck.setSettings(newSettings);
        setSettings(newSettings);

    };

    const onDeviceChange = async (newDevice?: Device) => {
        logger.log(`Handling new device ${newDevice?.name}`);
        const newSettings = settings == null ? {} as RelaySettings : { ...settings };
        newSettings.selectedDeviceId = newDevice?.id;
        newSettings.selectedDeviceName = newDevice?.name;
        streamdeck.setSettings(newSettings);
        setSettings(newSettings);
    };

    if (settings == null || isSettingsLoading) {
        return <Spinner />;
    }

    const relays = devices.filter(device => device.deviceType === DeviceType.Relay);
    const deviceOptions = relays.map(relay => ({ name: relay.name, value: relay.id, payload: relay } as DropDownOption<Device>));

    if (settings.selectedDeviceId == null && relays.length > 0) {
        onDeviceChange(relays[0]);
    }

    let editPanel: JSX.Element | null = (
        <>
            {!isDevicesLoading && devices != null &&
                <DropDown items={deviceOptions} disabled={isDevicesLoading} defaultValue={settings.selectedDeviceId} onChange={newSelectedDevice => onDeviceChange(newSelectedDevice.payload)} />}
        </>
    );
    if (settings.address == null || settings.address.length == 0) {
        editPanel = null;
    }

    return (
        <PropertyInspectorContainer>
            <TextBox label="Address" placeholder="Address of Homematic CCU" defaultValue={settings.address} onChange={(newAddress) => onIpChange(newAddress)} />
            {isDevicesLoading &&
                <Spinner />}
            {editPanel}
        </PropertyInspectorContainer>
    );
}