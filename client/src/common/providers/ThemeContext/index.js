import { set } from 'lodash';
import { parseCookies, setCookie } from 'nookies';
import React from 'react';

export const getInitialTheme = () => {
    if (typeof window !== 'undefined') {

        //get preferred color scheme of user
        const userMedia = window.matchMedia('(prefers-color-scheme: dark)');

        //check if cooike exists
        const cookies = parseCookies()

        if (!!cookies['COLOR_THEME']) {
            const storedPrefs = cookies['COLOR_THEME']

            //return stored preferences
            if (!!storedPrefs) return storedPrefs

            //if no local storages and browser preference is dark, return dark
            else if (userMedia.matches) return 'dark'
        }

        //when no local storage and browser preference is dark, return dark
        else if (userMedia.matches) {
            return 'dark'
        }
    }

    return 'light' // light theme as the default;
};

export const ThemeContext = React.createContext();

export const ThemeProvider = ({ initialTheme, children }) => {
    const [theme, setTheme] = React.useState(getInitialTheme);

    const rawSetTheme = (rawTheme) => {
        const root = window.document.documentElement;
        const userMedia = window.matchMedia('(prefers-color-scheme: dark)');

        const isSystem = rawTheme === 'system'
        const isDark = (rawTheme === 'dark' || (isSystem && userMedia.matches))

        root.classList.remove(isDark ? 'light' : 'dark');
        root.classList.add(isDark && 'dark');

        setTheme(isDark ? 'dark' : 'light')
    };

    if (initialTheme) {
        rawSetTheme(initialTheme);
    }

    React.useEffect(() => {
        rawSetTheme(theme);
    }, [theme]);

    return (
        <ThemeContext.Provider value={{ theme, setTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};