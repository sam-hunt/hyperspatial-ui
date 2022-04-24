import { useMemo, useEffect } from 'react';
// import { GameClient } from '../game/game-client';

const useGameClient = (webSocket: WebSocket, canvasEl: HTMLCanvasElement) => {
    // let gameClient = useMemo(() => new GameClient(webSocket, canvasEl), [webSocket, canvasEl]);

    // useEffect(() => {
    //     if (canvasEl) {
    //         gameClient.init().then(() => gameClient.run(0));
    //     }
    //     return () => {
    //         gameClient.destroy();
    //         gameClient = null;
    //     }
    // }, [gameClient])

    // return gameClient;
};

export default useGameClient;
