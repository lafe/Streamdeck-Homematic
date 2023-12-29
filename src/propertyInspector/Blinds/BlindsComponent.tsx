import React, { useCallback, useEffect, useMemo, useState } from "react";
import { DropDown, DropDownOption } from "../../components/DropDown/DropDown";
import { PropertyInspectorContainer } from "../../components/PropertyInspectorContainer/PropertyInspectorContainer";
import { Spinner } from "../../components/Spinner/Spinner";
import { NummericTextBox } from "../../components/TextBox/NummericTextBox";
import { TextBox } from "../../components/TextBox/TextBox";
import { Device } from "../../data/Device";
import { BlindsSettings } from "../../data/settings/BlindsSettings";
import { DeviceType } from "../../homematic/DeviceType";
import { loadDevices } from "../../homematic/loadDevices";
import { useLogger } from "../../hooks/useLogger";
import { useStreamDeck } from "../../streamdeck/React/useStreamDeck";
import { useStreamdeckConnected } from "../../streamdeck/React/useStreamdeckConnected";

export function BlindsComponent() {
    const [isDevicesLoading, setIsDevicesLoading] = useState(false);
    const [devices, setDevices] = useState<Device[]>([]);
    const [settings, setSettings] = useState<BlindsSettings | undefined>(undefined);
    const [isSettingsLoading, setIsSettingsLoading] = useState(false);

    const logger = useLogger("BlindsComponent");
    const streamdeck = useStreamDeck();
    const streamdeckConnected = useStreamdeckConnected();

    useEffect(() => {
        let didCancel = false;
        async function fetchDevices() {
            setIsDevicesLoading(true);
            const fetchedDevices = settings == null ? [] : await loadDevices(settings.address, settings.securityToken);
            if (!didCancel) {
                logger.log("Retrieved devices", fetchedDevices);
                setDevices(fetchedDevices);
                setIsDevicesLoading(false);
            }
        }
        fetchDevices();
        return () => { didCancel = true; };
    }, [settings, logger]);

    useEffect(() => {
        let didCancel = false;
        async function loadSettings() {
            if (!streamdeck.isConnected) {
                return;
            }
            setIsSettingsLoading(true);
            const loadedSettings = await streamdeck.getSettings<BlindsSettings>();
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

    const onIpChange = useCallback(
        async (newAddress?: string) => {
            logger.log(`Handling new address ${newAddress}`);
            const newSettings = settings == null ? {} as BlindsSettings : { ...settings };
            newSettings.address = newAddress ?? "";
            streamdeck.setSettings(newSettings);
            setSettings(newSettings);
        },
        [logger, settings, streamdeck],
    );

    const onSecurityTokenChange = useCallback(
        async (newToken?: string) => {
            logger.log(`Handling new security token ${newToken}`);
            const newSettings = settings == null ? {} as BlindsSettings : { ...settings };
            newSettings.securityToken = newToken ?? "";
            streamdeck.setSettings(newSettings);
            setSettings(newSettings);
        },
        [logger, settings, streamdeck],
    );

    const onDeviceChange = useCallback(
        async (newDevice?: Device) => {
            logger.log(`Handling new device ${newDevice?.name}`);
            const newSettings = settings == null ? {} as BlindsSettings : { ...settings };
            newSettings.selectedDeviceId = newDevice?.id;
            newSettings.selectedDeviceName = newDevice?.name;
            streamdeck.setSettings(newSettings);
            setSettings(newSettings);
        },
        [logger, settings, streamdeck]
    );

    const onHeightCHange = useCallback(
        async (newHeight?: number) => {
            logger.log(`Handling new target height ${newHeight}`);
            const newSettings = settings == null ? {} as BlindsSettings : { ...settings };
            newSettings.targetHeight = newHeight;
            streamdeck.setSettings(newSettings);
            setSettings(newSettings);
        },
        [logger, settings, streamdeck]
    );

    const blindsControls = useMemo(() => devices.filter(device => device.deviceType === DeviceType.BlindsSwitch || device.deviceType === DeviceType.BlindsRelais), [devices]);
    const deviceOptions = useMemo(() => blindsControls.map(blindControl => ({ name: blindControl.name, value: blindControl.id, payload: blindControl } as DropDownOption<Device>)), [blindsControls]);

    if (settings == null || isSettingsLoading) {
        return <Spinner />;
    }

    if (settings.selectedDeviceId == null && blindsControls.length > 0) {
        onDeviceChange(blindsControls[0]);
    }

    let editPanel: JSX.Element | null = (
        <>
            {!isDevicesLoading && devices != null &&
                <DropDown items={deviceOptions} disabled={isDevicesLoading} defaultValue={settings.selectedDeviceId} onChange={newSelectedDevice => onDeviceChange(newSelectedDevice.payload)} />}
            {settings != null && settings.selectedDeviceId != null &&
                <NummericTextBox disabled={isDevicesLoading} defaultValue={settings.targetHeight} label="Target height" placeholder="Target height of the blinds" minValue={0} maxValue={0} onChange={(newHeight) => onHeightCHange(newHeight)} />}
        </>
    );
    if (settings.address == null || settings.address.length == 0) {
        editPanel = null;
    }

    return (
        <PropertyInspectorContainer>
            <TextBox label="Address" placeholder="Address of Homematic CCU" defaultValue={settings.address} onChange={(newAddress) => onIpChange(newAddress)} />
            <TextBox label="Security Token" placeholder="Security Token from Homematic CCU" defaultValue={settings.securityToken} onChange={(newToken) => onSecurityTokenChange(newToken)} />
            {isDevicesLoading &&
                <Spinner />}
            {editPanel}
        </PropertyInspectorContainer>
    );
}