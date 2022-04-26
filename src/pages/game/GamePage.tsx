import { FC } from 'react';

import { Canvas } from './canvas/Canvas';
import { ChatOverlay } from './overlays/chat/ChatOverlay';
import { WebSocketStateOverlay } from './overlays/websocket-state/WebSocketStateOverlay';

export const GamePage: FC = () => (
    <>
        <Canvas />
        <WebSocketStateOverlay />
        <ChatOverlay />
    </>
);
