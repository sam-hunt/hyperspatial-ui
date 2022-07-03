import { useTheme } from '@mui/material';
import { hexToCss } from 'utils/color-format';

export interface ScrollbarStyleOptions {
    opacity?: number;
    isPaperBg?: boolean;
}

export const useScrollbarStyles = (options: ScrollbarStyleOptions) => {
    const { opacity, isPaperBg } = { opacity: 1.0, isPaperBg: false, ...options };
    const theme = useTheme();

    const trackBgPalette = isPaperBg ? theme.palette.background.paper : theme.palette.background.default;
    const trackBg = hexToCss(trackBgPalette, opacity);

    const thumbBgPalette = theme.palette.primary.main;
    const thumbBg = hexToCss(thumbBgPalette, opacity);

    const hoverBgPalette = theme.palette.secondary.main;
    const hoverBg = hexToCss(hoverBgPalette, opacity);

    /**
     * @todo TODO: Firefox styling!
     * @see https://stackoverflow.com/questions/6165472/custom-css-scrollbar-for-firefox
     */

    const styles = {
        '::-webkit-scrollbar': {
            width: '8px',
        },
        '::-webkit-scrollbar-track': {
            background: trackBg,
        },
        '::-webkit-scrollbar-thumb': {
            backgroundColor: thumbBg,
            borderRadius: '20px',
        },
        '::-webkit-scrollbar-thumb:hover': {
            backgroundColor: hoverBg,
        },
    };
    return styles;
};
