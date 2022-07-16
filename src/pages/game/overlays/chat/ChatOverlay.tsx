import dayjs from 'dayjs';
import { useState } from 'react';
import { animated, useSpring } from 'react-spring';
import { Box, TextField, useTheme } from '@mui/material';
import { mdiChatOutline, mdiChatProcessingOutline } from '@mdi/js';

import { useChat } from 'hooks/use-chat';
import { useLocalStorage } from 'hooks/use-local-storage';
import { useScrollbarStyles } from 'hooks/use-scrollbar-styles';

import { hexToCss } from 'utils/color-format';

import { ChatLine } from './ChatLine';
import { IconBadgeButton } from './IconBadgeButton';

import type { FC, KeyboardEvent } from 'react';

export const ChatOverlay: FC = () => {
    const [showChat, setShowChat] = useState<boolean>(false);
    const [newMessage, setNewMessage] = useState<string>('');
    const [lastSeenAt, setLastSeenAt] = useState<dayjs.Dayjs>(dayjs());

    // TODO: Refactor to player context
    // TODO: Refactor to ChatSendEvent and ChatReceiveEvent e.g. server can determine user id and serve back names, possibly color
    // and enforce channel etc
    const [author] = useLocalStorage<string>('playerName', 'Unknown');

    const { chatBuffer, sendChat } = useChat({ bufferSize: 100 });

    const [springStyle, springTrigger] = useSpring({ width: 0, height: 0, reset: true, reverse: !showChat }, []);

    const theme = useTheme();
    const opacity = 0.6;
    const scrollbarStyles = useScrollbarStyles({ opacity });

    const toggleChat = () => {
        springTrigger.start(!showChat ? { width: 480, height: 320 } : { width: 0, height: 0 });
        setShowChat(!showChat);
        setLastSeenAt(dayjs());
    };
    const unseenChatCount = showChat ? 0 : chatBuffer.reduce((acc, val) => acc + (dayjs(val.ts).diff(lastSeenAt, 'ms') > 0 ? 1 : 0), 0);

    const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            sendChat({ event: 'chat', ts: dayjs().toISOString(), author, text: newMessage });
            setNewMessage('');
        } else if (event.key === 'Escape') {
            toggleChat();
        }
    };

    return (
        <div style={{ position: 'absolute', left: '10px', bottom: '10px' }}>
            <div style={{ position: 'absolute', left: 1, bottom: 1, display: 'flex', flexDirection: 'row' }}>
                <IconBadgeButton
                    title="Chat"
                    color={showChat ? 'primary' : 'default'}
                    iconPath={showChat ? mdiChatOutline : mdiChatProcessingOutline}
                    onClick={toggleChat}
                    badgeColor="error"
                    badgeContent={unseenChatCount}
                />
            </div>
            <animated.div style={springStyle}>
                <div style={{
                    background: hexToCss(theme.palette.background.paper, opacity) || undefined,
                    paddingTop: '10px',
                    borderRadius: '15px',
                    height: '100%',
                    width: '100%',
                    display: 'flex',
                    flexDirection: 'column-reverse',
                }}
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
                            <Box
                                display="flex"
                                flexDirection="column-reverse"
                                sx={{ width: '100%', height: '100%', overflowY: 'overlay', ...scrollbarStyles }}
                            >
                                {chatBuffer.map((chat) => <ChatLine chat={chat} key={chat.author + chat.ts} />)}
                            </Box>
                        </>
                    )}
                </div>
            </animated.div>
        </div>
    );
};
