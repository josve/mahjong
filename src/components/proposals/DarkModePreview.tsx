"use client";

import React, {useState} from "react";
import {createTheme, ThemeProvider} from "@mui/material/styles";
import {Box, Chip, Paper, ToggleButton, ToggleButtonGroup, Typography, useMediaQuery} from "@mui/material";
import LightModeIcon from "@mui/icons-material/LightMode";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import SettingsBrightnessIcon from "@mui/icons-material/SettingsBrightness";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import baseTheme from "@/lib/theme";
import {ProposalTeamScore, Sparklines, TeamAvatar} from "@/components/proposals/shared";

export type ThemeMode = "light" | "dark" | "system";

const darkTheme = createTheme(baseTheme, {
    palette: {
        mode: "dark",
        primary: {main: "#E27A6E", contrastText: "#1B1212"},
        background: {default: "#161213", paper: "#221C1D"},
        text: {primary: "#EDE6E4", secondary: "#A89E9C"},
        gridBackground: "#2A2324",
    },
    typography: {
        h1: {color: "#F0A399"}, h2: {color: "#F0A399"}, h3: {color: "#F0A399"},
        h4: {color: "#F0A399"}, h5: {color: "#F0A399"}, h6: {color: "#F0A399"},
        body1: {color: "#EDE6E4"}, body2: {color: "#A89E9C"},
    },
});

/** Sun / auto / moon switch intended for the header or the profile page. */
export function ThemeModeSwitch({value, onChange}: {
    readonly value: ThemeMode;
    readonly onChange: (mode: ThemeMode) => void;
}) {
    return (
        <ToggleButtonGroup
            size="small"
            exclusive
            value={value}
            onChange={(_, mode: ThemeMode | null) => mode && onChange(mode)}
            aria-label="Färgtema"
            sx={{backgroundColor: "rgba(255,255,255,0.15)", borderRadius: 5, "& .MuiToggleButton-root": {border: 0, color: "white", px: 1.5}, "& .Mui-selected": {backgroundColor: "rgba(255,255,255,0.35) !important"}}}
        >
            <ToggleButton value="light" aria-label="Ljust"><LightModeIcon fontSize="small"/></ToggleButton>
            <ToggleButton value="system" aria-label="Följ systemet"><SettingsBrightnessIcon fontSize="small"/></ToggleButton>
            <ToggleButton value="dark" aria-label="Mörkt"><DarkModeIcon fontSize="small"/></ToggleButton>
        </ToggleButtonGroup>
    );
}

function MiniPage({mode, onModeChange, matches}: {
    readonly mode: ThemeMode;
    readonly onModeChange: (mode: ThemeMode) => void;
    readonly matches: { name: string; active?: boolean; teams: ProposalTeamScore[] }[];
}) {
    return (
        <Box sx={{backgroundColor: "background.default", borderRadius: 3, overflow: "hidden", border: "1px solid", borderColor: "divider"}}>
            <Box
                sx={{
                    display: "flex", alignItems: "center", justifyContent: "space-between", px: 2, py: 1.5, color: "white",
                    background: (theme) => theme.palette.mode === "dark"
                        ? "linear-gradient(120deg, #3A1F1C, #1E1414)"
                        : "radial-gradient(circle farthest-corner at 100px 100px, var(--gradient-start) 0%, var(--gradient-end) 100%)",
                }}
            >
                <Typography sx={{color: "white"}}><b>Mahjong</b> Master System</Typography>
                <ThemeModeSwitch value={mode} onChange={onModeChange}/>
            </Box>
            <Box sx={{p: 2, display: "grid", gap: 1.5}}>
                <Typography variant="h1" sx={{fontSize: 24}}>Matcher</Typography>
                {matches.map((match) => {
                    const sorted = [...match.teams].sort((a, b) => b.score - a.score);
                    return (
                        <Paper key={match.name} elevation={0} sx={{p: 1.5, borderRadius: 2, backgroundColor: "gridBackground"}}>
                            <Box sx={{display: "flex", justifyContent: "space-between", alignItems: "center"}}>
                                <Typography variant="h6" sx={{fontSize: 16}}>{match.name}</Typography>
                                <Sparklines teams={match.teams} width={90} height={24}/>
                            </Box>
                            {sorted.map((team, index) => (
                                <Box key={team.id} sx={{display: "flex", alignItems: "center", gap: 1, mt: 0.75}}>
                                    <TeamAvatar team={team} size={22}/>
                                    <Typography variant="body2" sx={{flexGrow: 1}}>{team.name}</Typography>
                                    {index === 0 && <EmojiEventsIcon sx={{fontSize: 16, color: "#E0B000"}}/>}
                                    <Typography variant="body1" sx={{fontWeight: 700}}>{team.score}</Typography>
                                </Box>
                            ))}
                            {match.active && <Chip size="small" color="primary" label="Aktiv match" sx={{mt: 1}}/>}
                        </Paper>
                    );
                })}
            </Box>
        </Box>
    );
}

interface Props {
    readonly matches: { name: string; active?: boolean; teams: ProposalTeamScore[] }[];
    /** Show the light and dark version next to each other instead of one switchable page. */
    readonly sideBySide?: boolean;
}

/**
 * Förslag 2: A real dark mode. Today the dark mode CSS variables are the same
 * as the light ones, so the site is bright white at night around the table.
 */
export default function DarkModePreview({matches, sideBySide = false}: Props) {
    const [mode, setMode] = useState<ThemeMode>("dark");
    const systemPrefersDark = useMediaQuery("(prefers-color-scheme: dark)");
    const dark = mode === "dark" || (mode === "system" && systemPrefersDark);

    if (sideBySide) {
        return (
            <Box sx={{display: "grid", gridTemplateColumns: {xs: "1fr", md: "1fr 1fr"}, gap: 3}}>
                <ThemeProvider theme={baseTheme}>
                    <MiniPage mode="light" onModeChange={() => undefined} matches={matches}/>
                </ThemeProvider>
                <ThemeProvider theme={darkTheme}>
                    <MiniPage mode="dark" onModeChange={() => undefined} matches={matches}/>
                </ThemeProvider>
            </Box>
        );
    }

    return (
        <ThemeProvider theme={dark ? darkTheme : baseTheme}>
            <Box sx={{maxWidth: 420}}>
                <MiniPage mode={mode} onModeChange={setMode} matches={matches}/>
            </Box>
        </ThemeProvider>
    );
}
