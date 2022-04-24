import Icon from '@mdi/react';
import { IconButton, Typography, useTheme } from '@mui/material';
import { NavLink } from 'react-router-dom';
import { useSpring, animated } from 'react-spring';
import INavItem from './nav-item.interface';

export interface INavOverlayItemProps {
    navItem: INavItem,
    delay: number,
}

const NavOverlayItem = ({ navItem, delay }: INavOverlayItemProps) => {

    const theme = useTheme();

    const fadeInLeftSpring = useSpring({
        to: { x: 0, opacity: 1 },
        from: { x: -30, opacity: 0 },
        delay,
    });

    const inactiveNavStyle = {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        textDecoration: 'none',
        color: theme.palette.getContrastText(theme.palette.background.default),
        '&:hover': {
            color: theme.palette.primary.dark,
        },
    }
    const activeNavStyle = {
        ...inactiveNavStyle,
        // color: theme.palette.mode === 'dark' ? theme.palette.primary.main : theme.palette.secondary.main,
        color: theme.palette.primary.main,
    }

    return (
        <animated.li style={fadeInLeftSpring} key={navItem.label}>
            <NavLink
                to={navItem.linkTo}
                style={({ isActive }) => isActive ? activeNavStyle : inactiveNavStyle as any}
            >
                <IconButton sx={{ color: 'inherit' }}>
                    <Icon
                        path={navItem.icon}
                        size={1.5}
                    />
                </IconButton>
                <Typography pl={1.5} className='no-select'>{navItem.label}</Typography>
            </NavLink>
        </animated.li>
    );
}

export default NavOverlayItem;