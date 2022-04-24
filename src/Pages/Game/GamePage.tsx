import Canvas from './Canvas/Canvas';
import ChatOverlay from './Overlays/Chat/ChatOverlay';
import WebSocketStateOverlay from './Overlays/WebSocketState/WebSocketStateOverlay';

const GamePage = () => {

    return (
        <>
            <Canvas />  
            <WebSocketStateOverlay />
            <ChatOverlay />
        </>
    );
};

export default GamePage;