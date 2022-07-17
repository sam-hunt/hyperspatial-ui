import { useCallback, useState } from 'react';
import dayjs from 'dayjs';
import { animated } from 'react-spring';
import { Box, TextField, useTheme } from '@mui/material';

import { hexToCss } from 'utils/color-format';

import { useLocalStorage } from 'hooks/use-local-storage';

import { ChatMessages } from './ChatMessages';
import { opacity } from './constants';

import type { FC, KeyboardEvent } from 'react';
import type { SpringValue } from 'react-spring';
import type { ChatEvent } from '../../events/chat-event';

interface ChatBoxProps {
    chatBuffer: ChatEvent[];
    sendChat: (chatEvent: ChatEvent) => void;
    showChat: boolean;
    springStyle: {
        height: SpringValue<number>;
        width: SpringValue<number>;
    };
    toggleChat: () => void;
}

export const ChatBox: FC<ChatBoxProps> = ({ chatBuffer, sendChat, showChat, springStyle, toggleChat }) => {
    const theme = useTheme();
    const [newMessage, setNewMessage] = useState('');
    const [author] = useLocalStorage('playerName', 'Unknown');

    const onKeyDown = useCallback((event: KeyboardEvent<HTMLDivElement>) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            sendChat({ event: 'chat', ts: dayjs().toISOString(), author, text: newMessage });
            setNewMessage('');
        } else if (event.key === 'Escape') {
            toggleChat();
        }
    }, [author, newMessage, sendChat, toggleChat]);

    return (
        <animated.div style={springStyle}>
            <Box
                display="flex"
                flexDirection="column-reverse"
                bgcolor={hexToCss(theme.palette.background.paper, opacity)}
                width="100%"
                height="100%"
                borderRadius="15px"
                pt="10px"
            >
                {showChat && (
                    <>
                        <Box display="flex" flexDirection="row" justifyContent="center" alignItems="center" m={1} ml={7}>
                            <TextField
                                value={newMessage}
                                onChange={(event) => setNewMessage(event.target.value)}
                                onKeyDown={onKeyDown}
                                size="small"
                                fullWidth
                                autoFocus
                            />
                        </Box>
                        <ChatMessages chatBuffer={chatBuffer} />
                    </>
                )}
            </Box>
        </animated.div>
    );
};
