import './App.css';
import { createContext } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { CssBaseline, PaletteMode, ThemeProvider } from '@mui/material';

import { NavOverlay } from 'components/nav-overlay/NavOverlay';
import { useLocalStorage } from 'hooks/use-local-storage';
import { GamePage } from 'pages/game/GamePage';
import { StatsPage } from 'pages/stats/StatsPage';
import { SettingsPage } from 'pages/settings/SettingsPage';
import { themeFromMode } from './theme';

export interface ThemeContextType {
    currentTheme: string,
    toggleTheme: () => void,
}

export const ThemeContext = createContext<ThemeContextType>({ currentTheme: 'dark', toggleTheme: () => { } });

const App = () => {
    const [currentTheme, setCurrentTheme] = useLocalStorage<PaletteMode>('currentTheme', 'dark');
    const toggleTheme = () => setCurrentTheme(currentTheme === 'dark' ? 'light' : 'dark');

    return (
        <ThemeContext.Provider value={{ currentTheme, toggleTheme }}>
            <ThemeProvider theme={themeFromMode(currentTheme)}>
                <CssBaseline enableColorScheme />
                <BrowserRouter>
                    <Routes>
                        <Route path='/' element={<NavOverlay />}>
                            <Route path='game' element={<GamePage />} />
                            <Route path='stats' element={<StatsPage />} />
                            <Route path='settings' element={<SettingsPage />} />
                        </Route>
                        <Route path='' element={<Navigate replace to='/game' />} />
                        <Route path='*' element={<Navigate replace to='/game' />} />
                    </Routes>
                </BrowserRouter>
            </ThemeProvider>
        </ThemeContext.Provider>
    );
}

export default App;
