import { getLogger } from "../common/Logger";
import { buildUrl } from "./buildUrl";

/**
 * Changes a state of a device
 * 
 * @param homematicAddress The address of the HomeMatic CCU
 * @param securityToken The security token to use for authentication
 * @param stateId The ID of the state/datapoint that should be changed
 * @param newValue The new value of the state/datapoint
 */
export async function setState(homematicAddress: string, securityToken: string, stateId: string, newValue: string): Promise<boolean> {
    const logger = getLogger("SetState");
    const url = buildUrl(homematicAddress, securityToken, "statechange", { "ise_id": stateId, "new_value": newValue });
    logger.log(`Setting state for ID ${stateId} to "${newValue}" using "${url}"`);

    const rawResult = await fetch(url);
    if (!rawResult.ok) {
        logger.error(`An error occurred whily trying to set the state for id ${stateId}: ${rawResult.status} - ${rawResult.statusText}`);
        return false;
    }
    const textResult = await rawResult.text();

    logger.log("Result of state change", textResult);
    return true;
}