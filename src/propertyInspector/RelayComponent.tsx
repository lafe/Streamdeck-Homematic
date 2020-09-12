import React, { useEffect, useState } from "react";
import { getLogger } from "../common/Logger";
import { PropertyInspectorContainer } from "../components/PropertyInspectorContainer/PropertyInspectorContainer";
import { Spinner } from "../components/Spinner/Spinner";
import { TextBox } from "../components/TextBox/TextBox";
import { Device } from "../data/Device";
import { RelaySettings } from "../data/settings/RelaySettings";
import { loadDevices } from "../homematic/loadDevices";
import { useStreamDeck } from "../streamdeck/useStreamDeck";

export function RelayComponent() {
    const [isDevicesLoading, setIsDevicesLoading] = useState(false);
    const [devices, setDevices] = useState<Device[]>([]);
    const [settings, setSettings] = useState<RelaySettings | undefined>(undefined);
    const [isSettingsLoading, setIsSettingsLoading] = useState(false);
    const [streamdeckConnected, setStreamdeckConnected] = useState(false);

    const logger = getLogger("RelayComponent");
    const streamdeck = useStreamDeck();

    useEffect(() => {
        if (streamdeck.isConnected) {
            logger.info("StreamDeck connected");
            setStreamdeckConnected(true);
            return;
        }
        logger.warn("StreamDeck not yet connected");
        let timerId: number | undefined = undefined;
        timerId = window.setInterval(() => {
            if (!streamdeck.isConnected) {
                logger.warn("StreamDeck still not connected.");
            } else {
                logger.info("StreamDeck connected.");
                setStreamdeckConnected(true);
            }
        }, 200);

        return () => { window.clearInterval(timerId); };
    }, [streamdeckConnected, streamdeck.isConnected, logger]);

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

    if (settings == null || isSettingsLoading) {
        return <Spinner />;
    }

    return (
        <PropertyInspectorContainer>
            <TextBox label="Address" placeholder="Address of Homematic CCU" defaultValue={settings.address} onChange={(newAddress) => onIpChange(newAddress)} />
            {isDevicesLoading && <Spinner />}
            {settings?.address}
            {devices.map((device, index) => <div key={`device-${device.name}-${index}`}>{device.name}</div>)}
        </PropertyInspectorContainer>
    );
}