import Icon from '@mdi/react';
import { Badge, IconButton } from '@mui/material';

/* eslint-disable react/require-default-props */
export interface IconBadgeButtonProps {
    title?: string;
    color?: 'info' | 'success' | 'warning' | 'error' | 'inherit' | 'primary' | 'default' | 'secondary';
    badgeColor?: 'primary' | 'default' | 'secondary' | 'error' | 'info' | 'success' | 'warning';
    badgeContent?: number;
    iconPath: string;
    onClick: () => void;
}

export const IconBadgeButton = ({ title, color, badgeColor, badgeContent, onClick, iconPath }: IconBadgeButtonProps) => (
    <IconButton title={title} color={color} onClick={onClick}>
        {(badgeContent || 0) > 0
            ? (
                <Badge badgeContent={badgeContent} color={badgeColor}>
                    <Icon path={iconPath} size={1.5} />
                </Badge>
            )
            : <Icon path={iconPath} size={1.5} />}
    </IconButton>
);
