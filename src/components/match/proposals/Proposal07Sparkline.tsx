import React from "react";
import {Box, Grid, Stack, Typography} from "@mui/material";
import {getPlayerResults, ProposalProps, scoreColor, signed} from "./playerResultData";

const WIDTH = 200;
const HEIGHT = 48;

function Sparkline({history, color, min, max}: { history: number[], color: string, min: number, max: number }) {
    const span = Math.max(1, max - min);
    const x = (i: number) => (i / Math.max(1, history.length - 1)) * (WIDTH - 8) + 4;
    const y = (v: number) => HEIGHT - 4 - ((v - min) / span) * (HEIGHT - 8);
    const points = history.map((v, i) => `${x(i)},${y(v)}`).join(" ");
    const last = history.length - 1;
    return (
        <svg viewBox={`0 0 ${WIDTH} ${HEIGHT}`} width="100%" height={HEIGHT} preserveAspectRatio="none">
            <line x1={0} x2={WIDTH} y1={y(500)} y2={y(500)} stroke="#bdbdbd" strokeDasharray="4 4"/>
            <polyline points={points} fill="none" stroke={color} strokeWidth={3} strokeLinejoin="round" strokeLinecap="round"/>
            <circle cx={x(last)} cy={y(history[last])} r={4.5} fill="white" stroke={color} strokeWidth={3}/>
        </svg>
    );
}

/** Proposal 7: a small line of the team's total through the match inside each card, on a shared scale. */
export default function Proposal07Sparkline(props: ProposalProps) {
    const results = getPlayerResults(props);
    const all = results.flatMap(r => r.history);
    const min = Math.min(...all);
    const max = Math.max(...all);
    return (
        <Grid container spacing={2}>
            {results.map(r => (
                <Grid key={r.teamId} size={{xs: 12, sm: 6, md: 3}}>
                    <Box sx={{border: r.isWinner ? `2px solid ${r.color}` : "1px solid #e0e0e0", borderRadius: 2, p: 2, height: "100%"}}>
                        <Stack direction="row" sx={{justifyContent: "space-between", alignItems: "baseline"}}>
                            <Typography variant="h6" sx={{color: r.color, fontWeight: 700}}>{r.name}</Typography>
                            <Typography variant="caption" color="text.secondary">{r.windName}{r.isWinner ? " · mahjong" : ""}</Typography>
                        </Stack>
                        <Sparkline history={r.history} color={r.color} min={min} max={max}/>
                        <Stack direction="row" sx={{justifyContent: "space-between", alignItems: "baseline", mt: 0.5}}>
                            <Typography sx={{fontSize: 24, fontWeight: 700}}>{r.totalAfter}</Typography>
                            <Typography sx={{fontWeight: 700, color: scoreColor(r.handScore)}}>
                                {signed(r.handScore)} <Typography component="span" variant="caption" color="text.secondary">({r.hand}p)</Typography>
                            </Typography>
                        </Stack>
                    </Box>
                </Grid>
            ))}
        </Grid>
    );
}
