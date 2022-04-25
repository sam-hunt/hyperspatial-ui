import { createTheme, PaletteMode } from '@mui/material';
import { grey } from '@mui/material/colors';

const lavender = {
    main: '#CB9EFF',
    light: '#FFCFFF',
    dark: '#996FCB',
    contrastText: '#FFFFFF',
};
const royal = {
    main: '#7005FC',
    light: '#AB4CFF',
    dark: '#2600C7',
    contrastText: '#FFFFFF',
};

const themeFromMode = (mode: PaletteMode) => createTheme({
    palette: {
        mode,
        primary: mode === 'dark' ? lavender : royal,
        secondary: mode === 'dark' ? royal : lavender,
        background: {
            paper: mode === 'dark' ? grey[900] : grey[300],
        },
    },
});

export const hexToRgb = (hex: string) => {
    // Expand shorthand form (e.g. '03F') to full form (e.g. '0033FF')
    const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    hex = hex.replace(shorthandRegex, (m, r, g, b) => r + r + g + g + b + b);
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}
export const hexToGL = (hex: string): [number, number, number, number] => {
    const rgb = hexToRgb(hex)!;
    return [rgb.r/255, rgb.g/255, rgb.b/255, 1.0];
}
const componentToHex = (c: number) => { const hex = c.toString(16); return hex.length === 1 ? '0' + hex : hex; }
export const rgbToHex = (r: number, g: number, b: number) => `#${componentToHex(r)}${componentToHex(g)}${componentToHex(b)}`;

export default themeFromMode;