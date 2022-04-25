import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Icon from '@mdi/react';
import { mdiStarFourPoints } from '@mdi/js';
import { Box, IconButton, Typography, useTheme } from '@mui/material';

import navItems from './nav-items';
import NavOverlayItem from './NavOverlayItem';

function NavOverlay() {
    const [isOpen, setIsOpen] = useState<boolean>(true);
    const theme = useTheme();

    const toggleMenu = () => setIsOpen(!isOpen);

    return (
        <>
            <nav style={{ position: 'absolute', top: 0, left: 0, padding: '15px' }}>
                <Box display='flex' flexDirection='row' alignItems='center'>
                    <IconButton onClick={toggleMenu}>
                        <Icon
                            path={mdiStarFourPoints}
                            title='Menu'
                            color={theme.palette.getContrastText(theme.palette.background.default)}
                            size={2}
                        />
                    </IconButton>
                    <Typography
                        variant='h4'
                        pl={2}
                        className='no-select'
                        style={{ cursor: 'pointer' }}
                        onClick={toggleMenu}
                    >
                        Hyperspatial
                    </Typography>
                </Box>
                {isOpen && <Box display='flex' flexDirection='column'>
                    <ul style={{ listStyle: 'none', paddingLeft: '10px' }}>
                        {navItems.map((navItem, i) => (
                            <NavOverlayItem navItem={navItem} delay={i * 50} key={navItem.label} />
                        ))}
                    </ul>
                </Box>}
            </nav>
            <Outlet />
        </>
    );
}

export default NavOverlay;