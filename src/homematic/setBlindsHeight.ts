import { getLogger } from "../common/Logger";
import { BlindsSettings } from "../data/settings/BlindsSettings";
import { StreamDeck } from "../streamdeck/StreamDeck";
import { filterDataPoints } from "./filterDataPoints";
import { loadState } from "./loadState";
import { setState } from "./setState";

export async function setBlindsHeight(streamdeck: StreamDeck, settings?: BlindsSettings) {
    const logger = getLogger("setBlindsHeight");

    if (settings == null) {
        logger.error("No settings provided. Cannot change height of the blinds.");
        return;
    }
    if (settings.address == null || settings.address.trim().length === 0) {
        logger.error("The address of the XMLAPI endpoint is not set. Cannot change height of the blinds.");
        return;
    }
    if (settings.selectedDeviceId == null || settings.selectedDeviceId.trim().length === 0) {
        logger.error("The device ID of the relay is empty. Cannot change height of the blinds.");
        return;
    }
    if(settings.targetHeight == null){
        logger.error("No target height set. Cannot change height of the blinds.");
        return;
    }

    logger.log(`Getting current state of device "${settings.selectedDeviceName}" (${settings.selectedDeviceId})`);
    const currentState = await loadState(settings.address, settings.selectedDeviceId);

    if (currentState == null) {
        logger.warn(`Could not get current state of device "${settings.selectedDeviceName}" (${settings.selectedDeviceId})`);
        return;
    }

    const stateDataPoints = filterDataPoints(currentState, ["LEVEL"]);
    if (stateDataPoints.length === 0) {
        logger.warn("No datapoint found for state \"LEVEL\"");
        return;
    }
    logger.log(`Found ${stateDataPoints} data point${(stateDataPoints.length === 1 ? "" : "s")}`);

    for (const dataPoint of stateDataPoints) {
        const newValue = settings.targetHeight / 100;
        logger.log(`Handling datapoint "${dataPoint.name}" (${dataPoint.id}) - Setting target height to ${newValue}`);
        await setState(settings.address, dataPoint.id, newValue.toString());
    }
}