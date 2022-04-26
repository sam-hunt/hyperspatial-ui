import { Box, Typography, useTheme } from '@mui/material';
import { FC } from 'react';
import { useSpring, animated } from 'react-spring'

export const WIP: FC = () => {
    const theme = useTheme();
    const springStyles = useSpring({
        loop: true,
        from: { rotateZ: 0 },
        to: { rotateZ: 360 },
        config: {
            mass: 1,
            tension: 25,
            friction: 10,
        },
    });

    const squareStyle = {
        backgroundColor: theme.palette.primary.main,
        width: 120,
        height: 120,
        borderRadius: 16,
        // TODO: fix hover?
        '&:hover': {
            backgroundColor: theme.palette.secondary.main,
        },
    };

    return (
        <Box display='flex' flexDirection='column' justifyContent='center' alignItems='center' width='100%' height='100%'>
            <animated.div style={springStyles}>
                <Box style={squareStyle} display='flex' justifyContent='center' alignItems='center'>
                    <Typography variant='h2' color={theme.palette.getContrastText(theme.palette.primary.main)}>WIP</Typography>
                </Box>
            </animated.div>
        </Box>
    );
};
