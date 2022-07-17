import { Box } from '@mui/material';
import { mdiChatOutline, mdiChatProcessingOutline } from '@mdi/js';

import { IconBadgeButton } from './IconBadgeButton';

import type { FC } from 'react';

interface ChatIconProps {
    showChat: boolean;
    unseenChatCount: number;
    onClick: () => void;
}

export const ChatIcon: FC<ChatIconProps> = ({ showChat, unseenChatCount, onClick }) => (
    <Box zIndex={1} position="absolute" left={1} bottom={1}>
        <IconBadgeButton
            title="Chat"
            color={showChat ? 'primary' : 'default'}
            iconPath={showChat ? mdiChatOutline : mdiChatProcessingOutline}
            onClick={onClick}
            badgeColor="error"
            badgeContent={unseenChatCount}
        />
    </Box>
);
