import { FC, KeyboardEvent, useState } from 'react';
import { animated, useSpring } from 'react-spring';
import Icon from '@mdi/react';
import { mdiChatOutline, mdiChatProcessingOutline } from '@mdi/js';
import { Badge, Box, IconButton, TextField, useTheme } from '@mui/material';
import dayjs from 'dayjs';

import { hexToRgb } from 'app/theme';
import { useChat } from 'hooks/use-chat';
import { useLocalStorage } from 'hooks/use-local-storage';

import { ChatLine } from './ChatLine';
import './ChatOverlay.css';

export const ChatOverlay: FC = () => {

    const [showChat, setShowChat] = useState<boolean>(false);
    const [newMessage, setNewMessage] = useState<string>('');
    const [lastSeenAt, setLastSeenAt] = useState<dayjs.Dayjs>(dayjs());

    // TODO: Refactor to player context
    // TODO: Send player id only, server can serve name
    const [author] = useLocalStorage<string>('playerName', 'Unknown');

    const { chatBuffer, sendChat } = useChat(50);
   
    const [springStyle, springTrigger] = useSpring({
        width: 0, height: 0,
        reset: true,
        reverse: !showChat,
    }, []);
    const theme = useTheme();

    const toggleChat = () => {
        springTrigger.start(!showChat ? { width: 480, height: 320 } : { width: 0, height: 0 });
        setShowChat(!showChat);
        setLastSeenAt(dayjs());
    }
    const iconPath = showChat ? mdiChatOutline : mdiChatProcessingOutline;
    const unseenChatCount = showChat ? 0 : chatBuffer.reduce((acc, val) => acc + (dayjs(val.ts).diff(lastSeenAt, 'milliseconds') > 0 ? 1 : 0), 0)

    const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            sendChat({
                event: 'chat',
                ts: dayjs().toISOString(),
                author,
                text: newMessage,
            });
            setNewMessage('');
        } else if (event.key === 'Escape') {
            toggleChat();
        }
    }
    const backgroundRgb = hexToRgb(theme.palette.background.paper)!;
    const background = `rgba(${backgroundRgb.r},${backgroundRgb.g},${backgroundRgb.b},0.5)`;

    return (
        <div style={{ position: 'absolute', left: '10px', bottom: '10px' }} >
            <animated.div style={springStyle}>
                <div style={{
                    background,
                    paddingTop: '10px',
                    borderRadius: '15px',
                    height: '100%',
                    width: '100%',
                    display: 'flex',
                    flexDirection: 'column-reverse',
                }}>
                    {showChat && <Box display='flex' flexDirection='row' justifyContent='center' alignItems='center' m={1} ml={7}>
                        <TextField
                            value={newMessage}
                            onChange={event => setNewMessage(event.target.value)}
                            onKeyDown={onKeyDown}
                            size='small'
                            fullWidth autoFocus
                        />
                    </Box>}
                    {showChat && <Box display='flex' flexDirection='column-reverse' className='hide-scrollbar' sx={{ width: '100%', height: '100%', overflowY: 'scroll' }}>
                        {chatBuffer.map(chat => <ChatLine chat={chat} key={chat.author+chat.ts} />)}
                    </Box>}
                </div>
            </animated.div>
            <div style={{ position: 'absolute', left: 1, bottom: 1, display: 'flex', flexDirection: 'row' }} >
                <IconButton title='Chat' color='primary' onClick={toggleChat}>
                    {unseenChatCount > 0 ?
                        <Badge badgeContent={unseenChatCount} color="error">
                            <Icon path={iconPath} size={1.5} />
                        </Badge> :
                        <Icon path={iconPath} size={1.5} />
                    }
                </IconButton>
            </div>
        </div >
    );
};
