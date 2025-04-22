import {StrictMode} from 'react'
import {createRoot} from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import {createTheme} from "@mui/material/styles";
import createCache from "@emotion/cache";
import {prefixer} from "stylis";
import rtlPlugin from "stylis-plugin-rtl";
import {CssBaseline, ThemeProvider} from "@mui/material";
import {CacheProvider} from '@emotion/react';
import {heIL} from '@mui/material/locale';
import {heIL as datagridHeIL} from '@mui/x-data-grid/locales';

const theme = createTheme(
    {
        direction: "rtl",
        palette: {
            mode: "dark",
        },
    },
    heIL,
    datagridHeIL
);

// Create rtl cache
const rtlCache = createCache({
    key: 'muirtl',
    stylisPlugins: [prefixer, rtlPlugin],
});

createRoot(document.getElementById('root')!).render(
    <ThemeProvider theme={theme}>
        <CssBaseline/>
        <CacheProvider value={rtlCache}>
            <StrictMode>
                <App/>
            </StrictMode>
        </CacheProvider>
    </ThemeProvider>
)
