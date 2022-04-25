import { useContext } from 'react';
import Icon from '@mdi/react';
import { mdiBrightness4, mdiBrightness7 } from '@mdi/js';
import { Container, IconButton, TextField, Typography } from '@mui/material';

import { ThemeContext } from 'App/App';
import useLocalStorage from 'hooks/use-local-storage';

const SettingsPage = () => {
    const { currentTheme, toggleTheme } = useContext(ThemeContext);

    // TODO: Refactor to player context
    const [playerName, setPlayerName] = useLocalStorage<string>('playerName', 'Unknown');

    return (
        <Container sx={{ pt: 10 }}>
            <Typography variant='h2'>Settings</Typography>
            <br/>
            <IconButton sx={{ ml: 1 }} onClick={toggleTheme} color='inherit'>
                {currentTheme === 'light'
                    ? <Icon path={mdiBrightness4} title='Menu' size={1} />
                    : <Icon path={mdiBrightness7} title='Menu' size={1} />
                }
            </IconButton>
            <Typography display='inline' className='no-select' style={{ cursor: 'pointer' }} onClick={toggleTheme}>Toggle theme</Typography>
            <br />
            <br />
            <TextField
                label='Player name'
                variant='standard'
                value={playerName}
                onChange={event => setPlayerName(event.target.value)}
            />
        </Container>
    );
}

export default SettingsPage;