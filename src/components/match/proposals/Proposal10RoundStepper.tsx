"use client";

import React, {useState} from "react";
import {Box, Chip, Grid, IconButton, Slider, Stack, Typography} from "@mui/material";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import {getPlayerResults, ProposalProps, scoreColor, signed} from "./playerResultData";
import ProposalBadges from "./ProposalBadges";

/**
 * Proposal 10: one widget with arrows and a slider to step through all rounds, instead of the long
 * "Visa alla omgångar" list.
 */
export default function Proposal10RoundStepper(props: ProposalProps) {
    const rounds = props.rounds ?? [props.round];
    const [index, setIndex] = useState(Math.max(0, rounds.indexOf(props.round)));
    const round = rounds[index];
    const results = getPlayerResults({...props, round});
    const last = rounds.length - 1;

    return (
        <Box sx={{border: "1px solid #e0e0e0", borderRadius: 2, overflow: "hidden"}}>
            <Stack direction="row" spacing={1} sx={{alignItems: "center", px: 2, py: 1, bgcolor: "#fafafa", borderBottom: "1px solid #e0e0e0"}}>
                <IconButton size="small" disabled={index === 0} onClick={() => setIndex(index - 1)}><ChevronLeftIcon/></IconButton>
                <Typography sx={{fontWeight: 700, minWidth: 110}}>Omgång {index + 1} av {rounds.length}</Typography>
                <IconButton size="small" disabled={index === last} onClick={() => setIndex(index + 1)}><ChevronRightIcon/></IconButton>
                <Slider size="small" min={0} max={last} value={index} onChange={(_, v) => setIndex(v as number)} sx={{mx: 2, flex: 1}}/>
                {index === last && <Chip label="Senaste" size="small" color="primary"/>}
            </Stack>
            <Grid container>
                {results.map(r => (
                    <Grid key={r.teamId} size={{xs: 6, md: 3}} sx={{p: 2, borderRight: "1px solid #f0f0f0", bgcolor: r.isWinner ? "#e8f5e9" : undefined}}>
                        <Typography variant="body2" color="text.secondary">{r.windName}{r.isWinner ? " · mahjong" : ""}</Typography>
                        <Typography variant="h6">{r.name}</Typography>
                        <Typography sx={{fontSize: 26, fontWeight: 700, color: scoreColor(r.handScore)}}>{signed(r.handScore)}</Typography>
                        <Typography variant="body2" color="text.secondary">{r.hand}p · totalt {r.totalAfter}</Typography>
                        <ProposalBadges badges={r.badges} justify="flex-start"/>
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
}
