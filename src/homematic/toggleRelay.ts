import { getLogger } from "../common/Logger";
import { RelaySettings } from "../data/settings/RelaySettings";
import { StreamDeck } from "../streamdeck/StreamDeck";
import { filterDataPoints } from "./filterDataPoints";
import { loadState } from "./loadState";
import { setState } from "./setState";

export async function toggleRelay(streamdeck: StreamDeck, settings?: RelaySettings) {
    const logger = getLogger("toggleRelay");

    if (settings == null) {
        logger.error("No settings provided. Cannot toggle relay.");
        return;
    }
    if (settings.address == null || settings.address.trim().length === 0) {
        logger.error("The address of the XMLAPI endpoint is not set. Cannot toggle relay.");
        return;
    }
    if (settings.securityToken == null || settings.securityToken.trim().length === 0) {
        logger.warn("The security token of the XMLAPI endpoint is not set. It's likely that the relay cannot be toggled.");
    }
    if (settings.selectedDeviceId == null || settings.selectedDeviceId.trim().length === 0) {
        logger.error("The device ID of the relay is empty. Cannot toggle relay.");
        return;
    }

    logger.log(`Getting current state of device "${settings.selectedDeviceName}" (${settings.selectedDeviceId})`);
    const currentState = await loadState(settings.address, settings.securityToken, settings.selectedDeviceId);

    if (currentState == null) {
        logger.warn(`Could not get current state of device "${settings.selectedDeviceName}" (${settings.selectedDeviceId})`);
        return;
    }

    const stateDataPoints = filterDataPoints(currentState, ["STATE"]);
    if (stateDataPoints.length === 0) {
        logger.warn("No datapoint found for state \"STATE\"");
        return;
    }
    logger.log(`Found ${stateDataPoints} data point${(stateDataPoints.length === 1 ? "" : "s")}`);

    for (const dataPoint of stateDataPoints) {
        logger.log(`Handling datapoint "${dataPoint.name}" (${dataPoint.id})`);

        // Toggle based on current value
        const newValue = dataPoint.value == "1" || dataPoint.value == "true" ? "false" : "true";
        await setState(settings.address, settings.securityToken, dataPoint.id, newValue);
    }
}