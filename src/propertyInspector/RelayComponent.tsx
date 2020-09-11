import React, { useEffect, useState } from "react";
import { getLogger } from "../common/Logger";
import { PropertyInspectorContainer } from "../components/PropertyInspectorContainer/PropertyInspectorContainer";
import { TextBox } from "../components/TextBox/TextBox";
import { Device } from "../data/Device";
import { loadDevices } from "../homematic/loadDevices";

export function RelayComponent() {
    const [ip, setIp] = useState<string | undefined>(undefined);
    const [devices, setDevices] = useState<Device[]>([]);
    const logger = getLogger("RelayComponent");

    useEffect(() => {
        let didCancel = false;
        async function fetchDevices() {
            const fetchedDevices = ip == null ? [] : await loadDevices(ip);
            if (!didCancel) {
                setDevices(fetchedDevices);
            }
        }
        fetchDevices();

        return () => { didCancel = true; };
    }, [ip]);

    const onIpChange = async (newIp?: string) => {
        logger.log(`Handling new IP ${newIp}`);
        setIp(newIp);
    };

    return (
        <PropertyInspectorContainer>
            <TextBox label="HomeMatic IP" onChange={(newIp) => onIpChange(newIp)} />
            {devices.map((device, index) => <div key={`device-${device.name}-${index}`}>{device.name}</div> )}
        </PropertyInspectorContainer>
    );
}