import { vec4 } from 'gl-matrix';

import { hexToRgb } from './hex-to-rgb';

export const hexToGL = (hex: string): vec4 => {
    const rgb = hexToRgb(hex)!;
    return [rgb.r / 255, rgb.g / 255, rgb.b / 255, 1.0];
};
