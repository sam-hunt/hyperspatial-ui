import { Typography, useTheme } from '@mui/material';
import { useLocalStorage } from 'hooks/use-local-storage';

import type { FC } from 'react';
import type { ChatEvent } from '../../events/chat-event';

export interface ChatMessageProps {
    chat: ChatEvent;
}

export const ChatMessage: FC<ChatMessageProps> = ({ chat }) => {
    const theme = useTheme();
    // TODO: Refactor to player context
    const [author] = useLocalStorage<string>('playerName', 'Unknown');

    // TODO: Compare on player id instead of name
    const color = chat.author === author
        ? theme.palette.primary.main
        : theme.palette.getContrastText(theme.palette.background.paper);

    return (
        <Typography
            key={chat.ts}
            sx={{ color, opacity: 1, ml: 3, mb: 1 }}
        >
            {`[${chat.author}] ${chat.text}`}
        </Typography>
    );
};
