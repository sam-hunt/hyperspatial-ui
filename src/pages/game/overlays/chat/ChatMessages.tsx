import { useMemo } from 'react';
import { Box } from '@mui/material';

import { useScrollbarStyles } from 'hooks/use-scrollbar-styles';

import { ChatMessage } from './ChatMessage';
import { opacity } from './constants';

import type { FC } from 'react';
import type { ChatEvent } from '../../events/chat-event';

interface ChatMessagesProps {
    chatBuffer: ChatEvent[];
}

export const ChatMessages: FC<ChatMessagesProps> = ({ chatBuffer }) => {
    const scrollbarStyles = useScrollbarStyles({ opacity });

    const renderChatMessages = useMemo(() => (
        chatBuffer.map((chat) => (
            <ChatMessage chat={chat} key={chat.author + chat.ts} />
        ))
    ), [chatBuffer]);

    return (
        <Box
            display="flex"
            flexDirection="column-reverse"
            sx={{ width: '100%', height: '100%', overflowY: 'overlay', ...scrollbarStyles }}
        >
            {renderChatMessages}
        </Box>
    );
};
