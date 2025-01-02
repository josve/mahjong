"use client"; // Mark this as a client component

import React from "react";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import theme from "@/lib/theme";
import {Box} from "@mui/material";

interface ProvidersProps {
    children: React.ReactNode;
}

const Providers: React.FC<ProvidersProps> = ({ children }) => {
    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Box>
                {children}
            </Box>
        </ThemeProvider>
    );
};

export default Providers;