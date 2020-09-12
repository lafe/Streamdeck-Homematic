import { useEffect, useState } from "react";
import { getLogger } from "../../common/Logger";
import { useStreamDeck } from "./useStreamDeck";

export function useStreamdeckConnected() {
    const [streamdeckConnected, setStreamdeckConnected] = useState(false);
    const streamdeck = useStreamDeck();
    const logger = getLogger("useStreamdeckConnected");
    
    useEffect(() => {
        if (streamdeck.isConnected) {
            logger.info("StreamDeck is connected");
            setStreamdeckConnected(true);
            return;
        }
        logger.warn("StreamDeck not yet connected");
        let timerId: number | undefined = undefined;
        timerId = window.setInterval(() => {
            if (!streamdeck.isConnected) {
                logger.warn("StreamDeck still not connected.");
            } else {
                logger.info("Detected StreamDeck connection");
                setStreamdeckConnected(true);
                window.clearInterval(timerId);
            }
        }, 200);

        return () => { window.clearInterval(timerId); };
    }, [streamdeckConnected, streamdeck.isConnected, logger]);

    return streamdeckConnected;
}