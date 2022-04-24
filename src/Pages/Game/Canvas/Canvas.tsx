import { useEffect, useState } from 'react';

import useWindowSize from '../../../hooks/use-window-size';
import renderWebglTest from './render-webgl-test';

const SCROLLBAR_WIDTH = 18;

const Canvas = () => {

    const [canvasEl, setCanvasEl] = useState<HTMLCanvasElement | null>(null);
    const [windowWidth, windowHeight] = useWindowSize();

    useEffect(() => {
        if (canvasEl) renderWebglTest(canvasEl);
    }, [canvasEl]);

    return (
        <canvas
            ref={el => setCanvasEl(el)}
            height={windowHeight - SCROLLBAR_WIDTH}
            width={windowWidth - SCROLLBAR_WIDTH}
        ></canvas>
    );
};

export default Canvas;




