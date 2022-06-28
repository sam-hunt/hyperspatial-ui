import { useTheme } from '@mui/material';
import { hexToRgb } from 'utils/hex-to-rgb';

export const useScrollbarStyles = (opacity: number = 1, isPaperBg?: boolean) => {
    const theme = useTheme();

    const trackBgPalette = isPaperBg ? theme.palette.background.paper : theme.palette.background.default;
    const trackBgColor = hexToRgb(trackBgPalette)!;
    const trackBg = `rgba(${trackBgColor.r},${trackBgColor.g},${trackBgColor.b},${opacity})`;

    const thumbBgPalette = theme.palette.primary.main;
    const thumbBgColor = hexToRgb(thumbBgPalette)!;
    const thumbBg = `rgba(${thumbBgColor.r},${thumbBgColor.g},${thumbBgColor.b},${opacity})`;

    const hoverBgPalette = theme.palette.secondary.main;
    const hoverBgColor = hexToRgb(hoverBgPalette)!;
    const hoverBg = `rgba(${hoverBgColor.r},${hoverBgColor.g},${hoverBgColor.b},${opacity})`;

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
