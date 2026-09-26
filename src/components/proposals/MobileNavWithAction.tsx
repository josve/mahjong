"use client";

import React, {useState} from "react";
import {Box, ButtonBase, Fab, Typography} from "@mui/material";
import CasinoOutlinedIcon from "@mui/icons-material/CasinoOutlined";
import TrendingUpOutlinedIcon from "@mui/icons-material/TrendingUpOutlined";
import CalculateOutlinedIcon from "@mui/icons-material/CalculateOutlined";
import Person2OutlinedIcon from "@mui/icons-material/Person2Outlined";
import AddIcon from "@mui/icons-material/Add";
import EditNoteIcon from "@mui/icons-material/EditNote";
import type {SvgIconComponent} from "@mui/icons-material";

const ITEMS: { label: string; icon: SvgIconComponent }[] = [
    {label: "Matcher", icon: CasinoOutlinedIcon},
    {label: "Statistik", icon: TrendingUpOutlinedIcon},
    {label: "Räknare", icon: CalculateOutlinedIcon},
    {label: "Profil", icon: Person2OutlinedIcon},
];

interface Props {
    /** When a match is going on the big button registers a round instead of creating a match. */
    readonly activeMatch?: string | null;
    readonly children?: React.ReactNode;
}

/**
 * Förslag 9: Bottom navigation for phones with a big action button in the
 * middle – "Ny match", or "Registrera omgång" while a match is going on – and
 * a clearer marker for the current page.
 */
export default function MobileNavWithAction({activeMatch = null, children}: Props) {
    const [active, setActive] = useState(0);
    const left = ITEMS.slice(0, 2);
    const right = ITEMS.slice(2);

    const item = ({label, icon: Icon}: typeof ITEMS[number], index: number) => {
        const selected = index === active;
        return (
            <ButtonBase key={label} onClick={() => setActive(index)} sx={{flex: 1, flexDirection: "column", py: 1, gap: 0.25}}>
                <Box sx={{px: 2, py: 0.25, borderRadius: 4, backgroundColor: selected ? "#F6DCD8" : "transparent", transition: "background-color 0.2s"}}>
                    <Icon sx={{color: selected ? "primary.main" : "#777", display: "block"}}/>
                </Box>
                <Typography sx={{fontSize: 11, fontWeight: selected ? 700 : 400, color: selected ? "primary.main" : "#777"}}>{label}</Typography>
            </ButtonBase>
        );
    };

    return (
        <Box
            sx={{
                width: 360, height: 720, borderRadius: "36px", border: "10px solid #1D1B1B", position: "relative",
                overflow: "hidden", backgroundColor: "white", boxShadow: "0 20px 50px rgba(0,0,0,0.25)",
            }}
        >
            <Box sx={{height: "100%", overflowY: "auto", pb: 12}}>{children}</Box>

            {activeMatch && (
                <Box sx={{position: "absolute", left: 12, right: 12, bottom: 96, px: 1.5, py: 1, borderRadius: 3, backgroundColor: "#2B2626", display: "flex", alignItems: "center", gap: 1}}>
                    <Box sx={{width: 8, height: 8, borderRadius: "50%", backgroundColor: "#7BD389", boxShadow: "0 0 0 4px rgba(123,211,137,0.25)"}}/>
                    <Typography sx={{color: "white", fontSize: 13, flexGrow: 1}}>{activeMatch} pågår</Typography>
                    <Typography sx={{color: "#FFB4A8", fontSize: 13, fontWeight: 700}}>Öppna</Typography>
                </Box>
            )}

            <Box
                sx={{
                    position: "absolute", left: 0, right: 0, bottom: 0, height: 76, display: "flex", alignItems: "stretch",
                    backgroundColor: "white", borderTop: "1px solid #eee", boxShadow: "0 -4px 16px rgba(0,0,0,0.05)",
                }}
            >
                {left.map((navItem, index) => item(navItem, index))}
                <Box sx={{width: 84, display: "flex", flexDirection: "column", alignItems: "center"}}>
                    <Fab
                        color="primary"
                        aria-label={activeMatch ? "Registrera omgång" : "Ny match"}
                        sx={{
                            mt: -3.5, width: 64, height: 64, boxShadow: "0 8px 20px rgba(148,48,48,0.4)",
                            background: "radial-gradient(circle at 30% 30%, var(--gradient-start), var(--gradient-end))",
                        }}
                    >
                        {activeMatch ? <EditNoteIcon sx={{fontSize: 32}}/> : <AddIcon sx={{fontSize: 32}}/>}
                    </Fab>
                    <Typography sx={{fontSize: 11, fontWeight: 700, color: "primary.main", mt: 0.25}}>
                        {activeMatch ? "Omgång" : "Ny match"}
                    </Typography>
                </Box>
                {right.map((navItem, index) => item(navItem, index + 2))}
            </Box>
        </Box>
    );
}
