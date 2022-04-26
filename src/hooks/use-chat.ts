import { useState } from 'react';

import { ChatEvent } from 'Pages/Game/Events/chat-event';
import useApiWebsocket from './use-api-websocket';

const useChat = (bufferSize: number) => {
    const [chatBuffer, setChatBuffer] = useState<ChatEvent[]>([]);
    const { lastEvent, sendEvent } = useApiWebsocket(['chat']);

    if (lastEvent && lastEvent !== chatBuffer[0]) {
        setChatBuffer([lastEvent as ChatEvent, ...chatBuffer.slice(0, bufferSize - 1)])
    }

    const sendChat = (chatEvent: ChatEvent) => sendEvent(chatEvent);

    return { chatBuffer, sendChat };
};

export default useChat;
