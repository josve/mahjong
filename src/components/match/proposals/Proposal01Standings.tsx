import React from "react";
import {Box, Grid, Stack, Typography} from "@mui/material";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import RemoveIcon from "@mui/icons-material/Remove";
import {byRank, getPlayerResults, ProposalProps, scoreColor, signed} from "./playerResultData";

function Movement({before, after}: { before: number, after: number }) {
    if (after < before) {
        return <Stack direction="row" sx={{alignItems: "center", color: "#2e7d32"}}><ArrowUpwardIcon fontSize="small"/>{before - after}</Stack>;
    }
    if (after > before) {
        return <Stack direction="row" sx={{alignItems: "center", color: "#c62828"}}><ArrowDownwardIcon fontSize="small"/>{after - before}</Stack>;
    }
    return <RemoveIcon fontSize="small" sx={{color: "text.disabled"}}/>;
}

/** Proposal 1: the cards are ordered by placing, with the total as the main number and how the placing changed. */
export default function Proposal01Standings(props: ProposalProps) {
    const results = getPlayerResults(props).sort(byRank);
    return (
        <Grid container spacing={2}>
            {results.map(r => (
                <Grid key={r.teamId} size={{xs: 12, sm: 6, md: 3}}>
                    <Box sx={{border: "1px solid #e0e0e0", borderRadius: 2, p: 2, height: "100%", display: "flex", gap: 2}}>
                        <Typography sx={{fontSize: 44, fontWeight: 800, lineHeight: 1, color: r.rankAfter === 1 ? "#c9a227" : "#bdbdbd"}}>
                            {r.rankAfter}
                        </Typography>
                        <Box sx={{flex: 1}}>
                            <Stack direction="row" sx={{justifyContent: "space-between", alignItems: "center"}}>
                                <Typography variant="h6">{r.name}</Typography>
                                <Movement before={r.rankBefore} after={r.rankAfter}/>
                            </Stack>
                            <Typography sx={{fontSize: 32, fontWeight: 700, lineHeight: 1.1}}>{r.totalAfter}</Typography>
                            <Typography variant="body2" sx={{color: scoreColor(r.handScore), fontWeight: 600}}>
                                {signed(r.handScore)} denna omgång
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                                {r.windName} · hand {r.hand}p{r.isWinner ? " · mahjong" : ""}
                            </Typography>
                        </Box>
                    </Box>
                </Grid>
            ))}
        </Grid>
    );
}
