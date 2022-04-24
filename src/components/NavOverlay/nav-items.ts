import INavItem from './nav-item.interface';
import { mdiChartBubble, mdiCog, mdiFlare } from '@mdi/js';

const navItems: INavItem[] = [
    {
        label: 'Game',
        icon: mdiFlare,
        linkTo: '/game',
    },
    {
        label: 'Stats',
        icon: mdiChartBubble,
        linkTo: '/stats',
    },
    {
        label: 'Settings',
        icon: mdiCog,
        linkTo: '/settings',
    }
];

export default navItems;