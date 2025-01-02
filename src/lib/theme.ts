// lib/theme.ts

import { createTheme } from "@mui/material/styles";

// Definiera ett anpassat gränssnitt för ytterligare färger
declare module "@mui/material/styles" {
    interface Palette {
        gradientStart: string;
        gradientEnd: string;
        matchItem: string;
        gridBackground: string;
        gridBackgroundHover: string;
        scoreNotSelectedBackground: string;
        scoreSelectedBackground: string;
    }

    interface PaletteOptions {
        gradientStart?: string;
        gradientEnd?: string;
        matchItem?: string;
        gridBackground?: string;
        gridBackgroundHover?: string;
        scoreNotSelectedBackground?: string;
        scoreSelectedBackground?: string;
    }
}

// Skapa temat
const theme = createTheme({
    palette: {
        primary: {
            main: "#943030", // --header-color
            contrastText: "#FFFFFF",
        },
        secondary: {
            main: "#55559C", // --muted-color
            contrastText: "#FFFFFF",
        },
        error: {
            main: "rgb(229, 70, 70)", // --strong-color
            contrastText: "#FFFFFF",
        },
        warning: {
            main: "#F6E400", // --warning-color (exempel)
            contrastText: "#000000",
        },
        success: {
            main: "#CCEECC", // --score-selected-background
            contrastText: "#000000",
        },
        info: {
            main: "#005530", // --info-color (exempel)
            contrastText: "#FFFFFF",
        },
        background: {
            default: "#FFFFFF", // --background-color
            paper: "#f9f9f9", // --light-white
        },
        text: {
            primary: "#606060", // --label_text-color
            secondary: "#909090", // --grey-color
        },
        // Anpassade färger
        gradientStart: "rgb(229, 70, 70)", // --gradient-start
        gradientEnd: "rgb(117, 62, 39)", // --gradient-end
        matchItem: "rgb(148, 48, 48)", // --match-item-color
        gridBackground: "#FAFAFA", // --grid-background-color
        gridBackgroundHover: "#FAF0F0", // --grid-background-hover-color
        scoreNotSelectedBackground: "#F6F6F6", // --score-not-selected-background
        scoreSelectedBackground: "#CCEECC", // --score-selected-background
    },
    typography: {
        fontFamily: '"Karla", sans-serif',
        h1: {
            fontFamily: 'HelveticaNeueLight, Helvetica, tahoma, arial',
            letterSpacing: "-0.02em",
            lineHeight: 1.2,
            fontWeight: 700,
            fontSize: "32px",
            textTransform: "uppercase",
            color: "#943030", // --header-color
        },
        h2: {
            fontFamily: 'HelveticaNeueLight, Helvetica, tahoma, arial',
            letterSpacing: "-0.02em",
            lineHeight: 1.2,
            fontWeight: 700,
            // Ange fontstorlek om det behövs
            color: "#943030",
        },
        h3: {
            fontFamily: 'HelveticaNeueLight, Helvetica, tahoma, arial',
            letterSpacing: "-0.02em",
            lineHeight: 1.2,
            fontWeight: 700,
            fontSize: "16px",
            color: "#943030",
        },
        h4: {
            fontFamily: 'HelveticaNeueLight, Helvetica, tahoma, arial',
            letterSpacing: "-0.02em",
            lineHeight: 1.2,
            fontWeight: 700,
            // Ange fontstorlek om det behövs
            color: "#943030",
        },
        h5: {
            fontFamily: 'HelveticaNeueLight, Helvetica, tahoma, arial',
            letterSpacing: "-0.02em",
            lineHeight: 1.2,
            fontWeight: 700,
            // Ange fontstorlek om det behövs
            color: "#943030",
        },
        h6: {
            fontFamily: 'HelveticaNeueLight, Helvetica, tahoma, arial',
            letterSpacing: "-0.02em",
            lineHeight: 1.2,
            fontWeight: 700,
            // Ange fontstorlek om det behövs
            color: "#943030",
        },
        body1: {
            fontFamily: '"Karla", sans-serif',
            lineHeight: 1.4,
            color: "#606060", // --label_text-color
        },
        body2: {
            fontFamily: '"Karla", sans-serif',
            lineHeight: 1.4,
            color: "#909090", // --grey-color
        },
        button: {
            fontFamily: '"Karla", sans-serif',
            textTransform: "none",
            fontWeight: 400,
            fontSize: "14px",
            color: "#FFFFFF", // Använd primär textfärg för knappar
        },
        // Anpassa andra typografivarianten efter behov
    },
    components: {
        MuiTypography: {
            defaultProps: {
                variantMapping: {
                    h1: "h1",
                    h2: "h2",
                    h3: "h3",
                    h4: "h4",
                    h5: "h5",
                    h6: "h6",
                    subtitle1: "h6",
                    subtitle2: "h6",
                    body1: "p",
                    body2: "p",
                    button: "span",
                },
            },
        },
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: "40px",
                    padding: "12px 30px",
                    backgroundColor: "#943030", // --muted-color eller annan vald färg
                    color: "#FFFFFF",
                    "&:hover": {
                        opacity: 0.9,
                    },
                    "&:active": {
                        backgroundColor: "rgb(229, 70, 70)", // --strong-color
                    },
                },
            },
        },
        MuiChip: {
            styleOverrides: {
                root: {
                    borderRadius: "8px",
                },
            },
        },
    },
});

export default theme;