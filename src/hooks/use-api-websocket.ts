import { useState } from 'react';
import useWebSocket, { Options as WsOptions, ReadyState } from 'react-use-websocket';

import { apiWsUrl } from 'app/env';
import { AbstractEvent } from 'pages/game/events/abstract-event';

export interface UseApiWebSocket<T extends AbstractEvent> {
    lastEvent: T | null;
    sendEvent: (jsonMessage: T, keep?: boolean) => void;
    readyState: ReadyState;
    // TODO: return a function which will hard reboot the websocket connection?
    // forceRefresh: () => void,
}

export const useApiWebSocket = <T extends AbstractEvent>(eventTypes: T['event'][] = []): UseApiWebSocket<T> => {
    const [cachedEvent, setCachedEvent] = useState<T | null>(null);
    let eventHasChanged: boolean = false;

    const wsOptions: WsOptions = {
        share: true,
        // TODO: try to get this to work across server restarts
        reconnectAttempts: 12,
        reconnectInterval: 5,
        filter: (event: MessageEvent) => eventTypes.includes(JSON.parse(event.data).event),
    };
    const { lastJsonMessage, sendJsonMessage, readyState } = useWebSocket(apiWsUrl, wsOptions);

    if (lastJsonMessage !== cachedEvent) {
        eventHasChanged = true;
        setCachedEvent(lastJsonMessage);
    }

    return {
        lastEvent: eventHasChanged ? lastJsonMessage : cachedEvent,
        sendEvent: sendJsonMessage,
        readyState,
    };
};
