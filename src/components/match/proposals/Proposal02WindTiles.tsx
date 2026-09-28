import React from "react";
import {Box, Chip, Grid, Typography} from "@mui/material";
import {getPlayerResults, ProposalProps, scoreColor, signed} from "./playerResultData";
import ProposalBadges from "./ProposalBadges";

/** Proposal 2: every card is headed by a mahjong tile with the player's wind. */
export default function Proposal02WindTiles(props: ProposalProps) {
    const results = getPlayerResults(props);
    return (
        <Grid container spacing={2}>
            {results.map(r => (
                <Grid key={r.teamId} size={{xs: 12, sm: 6, md: 3}}>
                    <Box sx={{
                        borderRadius: 3, p: 2, height: "100%", display: "flex", gap: 2, alignItems: "center",
                        background: r.isWinner ? "linear-gradient(135deg, #fff8e1, #ffecb3)" : "#fafafa",
                        border: r.isWinner ? "2px solid #c9a227" : "1px solid #e0e0e0",
                    }}>
                        <Box sx={{
                            width: 56, height: 74, borderRadius: 1.5, flexShrink: 0,
                            background: "linear-gradient(#fffdf5, #f1ead2)",
                            border: "1px solid #cfc6a8",
                            boxShadow: "0 4px 0 #2e7d5b, 0 5px 8px rgba(0,0,0,0.25)",
                            display: "flex", alignItems: "center", justifyContent: "center",
                            fontSize: 36, fontWeight: 700, color: r.wind === "E" ? "#c62828" : "#1a1a1a",
                            fontFamily: "'Noto Serif SC', serif",
                        }}>
                            {r.windChar}
                        </Box>
                        <Box sx={{minWidth: 0}}>
                            <Typography variant="overline" color="text.secondary" sx={{lineHeight: 1}}>{r.windName}</Typography>
                            <Typography variant="h6" noWrap>{r.name}</Typography>
                            <Typography sx={{fontSize: 26, fontWeight: 700, color: scoreColor(r.handScore), lineHeight: 1.1}}>
                                {signed(r.handScore)}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Hand {r.hand}p · totalt {r.totalAfter}
                            </Typography>
                            {r.isWinner && <Chip label="Mahjong!" size="small" sx={{mt: 0.5, bgcolor: "#c9a227", color: "white", fontWeight: 700}}/>}
                            <ProposalBadges badges={r.badges} justify="flex-start"/>
                        </Box>
                    </Box>
                </Grid>
            ))}
        </Grid>
    );
}
