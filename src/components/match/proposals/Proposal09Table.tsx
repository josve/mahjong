import React from "react";
import {Box, Typography} from "@mui/material";
import {getPlayerResults, PlayerResult, ProposalProps, signed} from "./playerResultData";
import ProposalBadges from "./ProposalBadges";

/** Where each wind sits around the table, seen from East. */
const SEAT: { [wind: string]: React.CSSProperties } = {
    E: {gridColumn: 2, gridRow: 3},
    S: {gridColumn: 3, gridRow: 2},
    W: {gridColumn: 2, gridRow: 1},
    N: {gridColumn: 1, gridRow: 2},
};

function Seat({r}: { r: PlayerResult }) {
    return (
        <Box sx={{
            ...SEAT[r.wind], justifySelf: "center", alignSelf: "center", textAlign: "center",
            bgcolor: r.isWinner ? "#fff8e1" : "rgba(255,255,255,0.95)", borderRadius: 2, px: 2, py: 1, minWidth: 130,
            boxShadow: r.isWinner ? "0 0 0 3px #c9a227, 0 4px 12px rgba(0,0,0,0.3)" : "0 2px 8px rgba(0,0,0,0.25)",
        }}>
            <Typography variant="caption" color="text.secondary">{r.windChar} {r.windName}</Typography>
            <Typography sx={{fontWeight: 700}}>{r.name}</Typography>
            <Typography sx={{fontSize: 22, fontWeight: 800, color: r.handScore >= 0 ? "#2e7d32" : "#c62828"}}>{signed(r.handScore)}</Typography>
            <Typography variant="caption" color="text.secondary">{r.hand}p · {r.totalAfter}</Typography>
            <ProposalBadges badges={r.badges} justify="center"/>
        </Box>
    );
}

/** Proposal 9: the four teams sit around a felt table in their wind's seat, the way the round was played. */
export default function Proposal09Table(props: ProposalProps) {
    const results = getPlayerResults(props);
    const winner = results.find(r => r.isWinner);
    return (
        <Box sx={{
            display: "grid", gridTemplateColumns: "1fr 1.2fr 1fr", gridTemplateRows: "auto minmax(140px, auto) auto", gap: 1,
            p: 2, borderRadius: 4, maxWidth: 720, mx: "auto",
            background: "radial-gradient(circle at center, #2f7d55, #1b4d34)",
            border: "10px solid #6b3f22",
        }}>
            {results.map(r => <Seat key={r.teamId} r={r}/>)}
            <Box sx={{gridColumn: 2, gridRow: 2, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", color: "white"}}>
                <Typography sx={{fontSize: 40, lineHeight: 1}}>🀄</Typography>
                <Typography variant="body2" sx={{color: "white", opacity: 0.9}}>
                    {winner ? `${winner.name} tog hem` : "Ingen mahjong"}
                </Typography>
            </Box>
        </Box>
    );
}
