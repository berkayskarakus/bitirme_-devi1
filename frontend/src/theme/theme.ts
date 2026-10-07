import { createTheme } from '@mui/material/styles';

const theme = createTheme({
    palette: {

        primary: {
            main: '#004D40',

            contrastText: '#ffffff',
        },

        secondary: {
            main: '#F57F17',
            contrastText: '#ffffff',
        },

        error: {
            main: '#B71C1C',
        },

        info: {
            main: '#0d1057',
        },

        text: {
            primary: '#212121',
            secondary: '#3d677b',
        },
        background: {
            default: '#f4f6f8',
            paper: '#ffffff',
        },
    },
    typography: {
        fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
        h1: {
            fontSize: '2rem',
            fontWeight: 500,
            color: '#004D40',
        },
        h2: {
            fontSize: '1.75rem',
            fontWeight: 500,
        },

        body1: {
            color: '#455A64',
        }
    },
    components: {

        MuiButton: {
            styleOverrides: {
                root: {
                    textTransform: 'none',
                    borderRadius: '8px',
                },
            },
        },
        MuiAppBar: {
            styleOverrides: {
                root: {

                    backgroundColor: '#004D40',
                }
            }
        }
    },
});

export default theme;