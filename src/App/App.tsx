import './App.css';
import { CssBaseline, PaletteMode, ThemeProvider } from '@mui/material';
import { createContext } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import useLocalStorage from '../hooks/use-local-storage';
import themeFromMode from './theme';
import GamePage from '../Pages/Game/GamePage';
import NavOverlay from '../components/NavOverlay/NavOverlay';
import StatsPage from '../Pages/Stats/StatsPage';
import SettingsPage from '../Pages/Settings/SettingsPage';

export interface IThemeContext {
  currentTheme: string,
  toggleTheme: () => void,
}

export const ThemeContext = createContext<IThemeContext>({ currentTheme: 'dark', toggleTheme: () => { } });

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
