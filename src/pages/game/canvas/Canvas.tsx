import { useEffect, useMemo, useState } from 'react';
import { useTheme } from '@mui/material';

import { useWindowSize } from 'hooks/use-window-size';
import { useApiWebSocket } from 'hooks/use-api-websocket';

import { hexToGL } from 'utils/color-format';

import { SimulationImpl } from '../simulation/simulation-impl';
import './Canvas.css';

import type { FC } from 'react';
import type { Simulation } from '../simulation/simulation.interface';

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
            tabIndex={0}
            ref={(el) => setCanvasEl(el)}
            height={windowHeight - SCROLLBAR_WIDTH}
            width={windowWidth - SCROLLBAR_WIDTH}
            className="no-focus-outline"
        />
    );
};
