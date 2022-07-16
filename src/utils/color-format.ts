import type { vec4 } from 'gl-matrix';

const matchHex = (hex: string) => {
    // Expand shorthand form (e.g. '03F') to full form (e.g. '0033FF')
    const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    const fullHex = hex.replace(shorthandRegex, (m, r, g, b) => r + r + g + g + b + b);
    return /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(fullHex);
};

export const hexToGL = (hex: string): vec4 => {
    const result = matchHex(hex);
    if (!result) return [1, 0, 0, 1];

    return [
        parseInt(result[1], 16) / 255,
        parseInt(result[2], 16) / 255,
        parseInt(result[3], 16) / 255,
        1.0,
    ];
};

export const hexToCss = (hex: string, opacity: number) => {
    const result = matchHex(hex);
    if (!result) return null;
    return `rgba(${parseInt(result[1], 16)},${parseInt(result[2], 16)},${parseInt(result[3], 16)},${opacity})`;
};

const componentToHex = (c: number) => {
    const hex = c.toString(16);
    return hex.length === 1 ? `0${hex}` : hex;
};

export const rgbToHex = (r: number, g: number, b: number) => `#${componentToHex(r)}${componentToHex(g)}${componentToHex(b)}`;
