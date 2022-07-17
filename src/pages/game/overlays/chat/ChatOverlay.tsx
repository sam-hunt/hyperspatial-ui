import dayjs from 'dayjs';
import { useCallback, useMemo, useState } from 'react';
import { useSpring } from 'react-spring';
import { Resizable } from 'react-resizable';
import { Box } from '@mui/material';

import { useChat } from 'hooks/use-chat';

import { ChatIcon } from './ChatIcon';
import { ChatBox } from './ChatBox';

import type { FC } from 'react';
import type { ResizableProps } from 'react-resizable';

/*
 * TODO: Refactor useLocalStorage to player context
 * TODO: Refactor to ChatSendEvent and ChatReceiveEvent
 * e.g. server can determine user id and serve back names,
 * possibly color and enforce channel etc.
 */

export const ChatOverlay: FC = () => {
    const [showChat, setShowChat] = useState(false);
    const [lastSeenAt, setLastSeenAt] = useState(dayjs());
    const [resize, setResize] = useState({ width: 480, height: 320 });

    const { chatBuffer, sendChat } = useChat({ bufferSize: 100 });
    const [springStyle, springTrigger] = useSpring({ width: 0, height: 0, reset: true, reverse: !showChat }, []);

    const toggleChat = useCallback(
        () => {
            springTrigger.start(!showChat ? { width: resize.width, height: resize.height } : { width: 0, height: 0 });
            setShowChat(!showChat);
            setLastSeenAt(dayjs());
        },
        [resize.height, resize.width, showChat, springTrigger],
    );

    const unseenChatCount = useMemo(() => {
        if (showChat) return 0;
        return chatBuffer.reduce((acc, val) => acc + (dayjs(val.ts).diff(lastSeenAt, 'ms') > 0 ? 1 : 0), 0);
    }, [chatBuffer, lastSeenAt, showChat]);

    const onResize: ResizableProps['onResize'] = (event, { size }) => {
        setResize(size);
    };

    return (
        <Box position="absolute" left={10} bottom={10}>
            <ChatIcon showChat={showChat} unseenChatCount={unseenChatCount} onClick={toggleChat} />
            <Resizable resizeHandles={['ne']} width={resize.width} height={resize.height} onResize={onResize}>
                <ChatBox
                    chatBuffer={chatBuffer}
                    sendChat={sendChat}
                    showChat={showChat}
                    springStyle={springStyle}
                    toggleChat={toggleChat}
                />
            </Resizable>
        </Box>
    );
};
