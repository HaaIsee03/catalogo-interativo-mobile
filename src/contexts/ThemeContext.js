import { createContext, useContext, useState } from 'react';

// Definição das Cores
export const themes = {
  light: {
    background: '#F5F7FA',
    surface: '#FFFFFF',
    text: '#1A1A1A',
    textSecondary: '#666666',
    border: '#EEEEEE',
    primary: '#4A90E2',
    icon: '#333333'
  },
  dark: {
    background: '#121212',
    surface: '#1E1E1E',
    text: '#E0E0E0',
    textSecondary: '#AAAAAA',
    border: '#333333',
    primary: '#4A90E2', // Mantemos o azul ou clareamos um pouco
    icon: '#FFFFFF'
  }
};

const ThemeContext = createContext({});

export function ThemeProvider({ children }) {
  const [isDark, setIsDark] = useState(false); // Padrão Claro

  const toggleTheme = () => {
    setIsDark(!isDark);
  };

  const theme = isDark ? themes.dark : themes.light;

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme, theme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}