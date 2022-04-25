import { useTheme } from '@mui/material';
import { useEffect, useState } from 'react';

import useWindowSize from 'hooks/use-window-size';
import renderWebglSquare from './render-webgl-square';

const SCROLLBAR_WIDTH = 18;

const Canvas = () => {

    const [canvasEl, setCanvasEl] = useState<HTMLCanvasElement | null>(null);
    const [windowWidth, windowHeight] = useWindowSize();
    const theme = useTheme();

    useEffect(() => {
        // if (canvasEl) renderWebglRect(canvasEl, theme.palette.background.default);
        if (canvasEl) renderWebglSquare(canvasEl, theme.palette.background.default);
    }, [canvasEl, windowWidth, windowHeight, theme]);

    return (
        <canvas
            ref={el => setCanvasEl(el)}
            height={windowHeight - SCROLLBAR_WIDTH}
            width={windowWidth - SCROLLBAR_WIDTH}
        ></canvas>
    );
};

export default Canvas;




