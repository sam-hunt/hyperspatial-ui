import { useTheme } from '@mui/material';
import { FC, useEffect, useMemo, useState } from 'react';

import { useWindowSize } from 'hooks/use-window-size';
import { useApiWebSocket } from 'hooks/use-api-websocket';
import { Simulation, SimulationImpl } from '../simulation/simulation';
import { hexToGL } from 'app/theme';

const SCROLLBAR_WIDTH = 18;

export const Canvas: FC = () => {

    const simulation: Simulation = useMemo(() => new SimulationImpl(), []);
    const [canvasEl, setCanvasEl] = useState<HTMLCanvasElement | null>(null);
    const [windowWidth, windowHeight] = useWindowSize();

    const theme = useTheme();
    const bgColor = hexToGL(theme.palette.background.default);

    const { lastEvent, sendEvent } = useApiWebSocket(['spawn', 'despawn', 'move']);

    useEffect(() => {
        if (!canvasEl || simulation.isRunning) return;
        simulation.run(canvasEl, bgColor);
    }, [canvasEl, simulation, bgColor]);

    useEffect(() => {
        if (lastEvent) simulation.queueEvent(lastEvent);
    }, [simulation, lastEvent]);

    useEffect(() => {
        simulation.eventCallback = sendEvent;
    }, [simulation, sendEvent]);

    return (
        <canvas
            ref={el => setCanvasEl(el)}
            height={windowHeight - SCROLLBAR_WIDTH}
            width={windowWidth - SCROLLBAR_WIDTH}
        ></canvas>
    );
};
