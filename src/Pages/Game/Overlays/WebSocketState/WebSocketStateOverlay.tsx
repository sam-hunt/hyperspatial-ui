import Icon from '@mdi/react';
import { mdiCheckCircle, mdiCloseCircle, mdiInformation, mdiLoading } from '@mdi/js';
import { IconButton } from '@mui/material';
import { ReadyState } from 'react-use-websocket';

import useApiWebsocket from 'hooks/use-api-websocket';

const wsStates = {
    [ReadyState.CONNECTING]: {
        title: 'Websocket Connecting...',
        color: 'info',
        icon: mdiLoading,
        spin: true,
    },
    [ReadyState.OPEN]: {
        title: 'Websocket Connected',
        color: 'success',
        icon: mdiCheckCircle,
        spin: false,
    },
    [ReadyState.CLOSING]: {
        title: 'Websocket Closing...',
        color: 'warning',
        icon: mdiLoading,
        spin: true,
    },
    [ReadyState.CLOSED]: {
        title: 'Websocket Closed',
        color: 'error',
        icon: mdiCloseCircle,
        spin: false,
    },
    [ReadyState.UNINSTANTIATED]: {
        title: 'Websocket Uninstantiated',
        color: 'warning',
        icon: mdiInformation,
        spin: false,
    },
};

const WebSocketStateOverlay = () => {

    const { readyState } = useApiWebsocket();
    const { title, color, icon, spin } = wsStates[readyState];

    return (
        <div style={{ position: 'absolute', top: 0, right: 0 }} >
            <IconButton title={title} color={color as any}>
                <Icon path={icon} spin={spin} size={1} />
            </IconButton>
        </div>
    );
}

export default WebSocketStateOverlay;