import { useState } from 'react';

import { useApiWebSocket } from './use-api-websocket';

import type { ChatEvent } from 'types/events/chatEvent';

export interface UseChatOptions {
    bufferSize?: number;
}

export const useChat = (options: UseChatOptions) => {
    const { bufferSize } = { bufferSize: 100, ...options };
    const [chatBuffer, setChatBuffer] = useState<ChatEvent[]>([]);
    const { lastEvent, sendEvent } = useApiWebSocket(['chat']);

    if (lastEvent && lastEvent !== chatBuffer[0]) {
        setChatBuffer([lastEvent as ChatEvent, ...chatBuffer.slice(0, bufferSize - 1)]);
    }

    const sendChat = (chatEvent: ChatEvent) => sendEvent(chatEvent);

    return { chatBuffer, sendChat };
};
