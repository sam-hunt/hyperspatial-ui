import { mdiChartBubble, mdiCog, mdiFlare } from '@mdi/js';

export interface NavItem {
    label: string;
    icon: string;
    linkTo: string;
}

export const navItems: NavItem[] = [
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
