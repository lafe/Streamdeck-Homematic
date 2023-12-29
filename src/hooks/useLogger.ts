import { useMemo } from "react";
import { getLogger } from "../common/Logger";

export function useLogger(name: string) {
    const logger = useMemo(() => getLogger(name), [name]);
    return logger;
}