import React, { useCallback, useEffect, useMemo, useState } from "react";
import { getLogger } from "../../common/Logger";
import { DropDown, DropDownOption } from "../../components/DropDown/DropDown";
import { PropertyInspectorContainer } from "../../components/PropertyInspectorContainer/PropertyInspectorContainer";
import { Spinner } from "../../components/Spinner/Spinner";
import { TextBox } from "../../components/TextBox/TextBox";
import { Device } from "../../data/Device";
import { ClimateSettings } from "../../data/settings/ClimateSettings";
import { DeviceType } from "../../homematic/DeviceType";
import { loadDevices } from "../../homematic/loadDevices";
import { useStreamDeck } from "../../streamdeck/React/useStreamDeck";
import { useStreamdeckConnected } from "../../streamdeck/React/useStreamdeckConnected";

export function ClimateComponent() {
    const [isDevicesLoading, setIsDevicesLoading] = useState(false);
    const [devices, setDevices] = useState<Device[]>([]);
    const [settings, setSettings] = useState<ClimateSettings | undefined>(undefined);
    const [isSettingsLoading, setIsSettingsLoading] = useState(false);

    const logger = getLogger("ClimateComponent");
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
            const loadedSettings = await streamdeck.getSettings<ClimateSettings>();
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
            const newSettings = settings == null ? {} as ClimateSettings : { ...settings };
            newSettings.address = newAddress ?? "";
            streamdeck.setSettings(newSettings);
            setSettings(newSettings);

        },
        [logger, settings, streamdeck]
    );
    
    const onSecurityTokenChange = useCallback(
        async (newToken?: string) => {
            logger.log(`Handling new security token ${newToken}`);
            const newSettings = settings == null ? {} as ClimateSettings : { ...settings };
            newSettings.securityToken = newToken ?? "";
            streamdeck.setSettings(newSettings);
            setSettings(newSettings);
        },
        [logger, settings, streamdeck],
    );

    const onDeviceChange = useCallback(
        async (newDevice?: Device) => {
            logger.log(`Handling new device ${newDevice?.name}`);
            const newSettings = settings == null ? {} as ClimateSettings : { ...settings };
            newSettings.selectedDeviceId = newDevice?.id;
            newSettings.selectedDeviceName = newDevice?.name;
            streamdeck.setSettings(newSettings);
            setSettings(newSettings);
        },
        [logger, settings, streamdeck]
    );

    const climateControls = useMemo( () => devices.filter(device => device.deviceType === DeviceType.ClimateControl), [devices]);
    const deviceOptions = useMemo(() => climateControls.map(climateControls => ({ name: climateControls.name, value: climateControls.id, payload: climateControls } as DropDownOption<Device>)), [climateControls]);

    if (settings == null || isSettingsLoading) {
        return <Spinner />;
    }
    if (settings.selectedDeviceId == null && climateControls.length > 0) {
        onDeviceChange(climateControls[0]);
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
            <TextBox label="Security Token" placeholder="Security Token from Homematic CCU" defaultValue={settings.securityToken} onChange={(newToken) => onSecurityTokenChange(newToken)} />
            {isDevicesLoading &&
                <Spinner />}
            {editPanel}
        </PropertyInspectorContainer>
    );
}