import { Canvas } from './canvas/Canvas';
import { ChatOverlay } from './overlays/chat/ChatOverlay';
import { WebSocketStateOverlay } from './overlays/websocket-state/WebSocketStateOverlay';

import type { FC } from 'react';

export const GamePage: FC = () => (
    <>
        <Canvas />
        <WebSocketStateOverlay />
        <ChatOverlay />
    </>
);
