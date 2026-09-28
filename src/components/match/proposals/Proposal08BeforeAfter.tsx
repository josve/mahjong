"use client";

import React, {useEffect} from "react";
import {Box, Grid, Stack, Typography} from "@mui/material";
import {animate, motion, useMotionValue, useTransform} from "motion/react";
import EastIcon from "@mui/icons-material/East";
import {getPlayerResults, ProposalProps, scoreColor, signed} from "./playerResultData";
import ProposalBadges from "./ProposalBadges";

function CountUp({from, to}: { from: number, to: number }) {
    const value = useMotionValue(from);
    const rounded = useTransform(value, v => Math.round(v).toString());
    useEffect(() => {
        const controls = animate(value, to, {duration: 1.2, ease: "easeOut"});
        return () => controls.stop();
    }, [from, to, value]);
    return <motion.span>{rounded}</motion.span>;
}

/** Proposal 8: the total counts up from before to after the round, so the change is felt when a new round arrives. */
export default function Proposal08BeforeAfter(props: ProposalProps) {
    const results = getPlayerResults(props);
    return (
        <Grid container spacing={2}>
            {results.map((r, i) => (
                <Grid key={r.teamId} size={{xs: 12, sm: 6, md: 3}}>
                    <motion.div initial={{opacity: 0, y: 16}} animate={{opacity: 1, y: 0}} transition={{delay: i * 0.08}}>
                        <Box sx={{border: "1px solid #e0e0e0", borderLeft: `6px solid ${r.color}`, borderRadius: 2, p: 2}}>
                            <Stack direction="row" sx={{justifyContent: "space-between"}}>
                                <Typography variant="h6">{r.name}</Typography>
                                <Typography variant="body2" color="text.secondary">{r.windName}</Typography>
                            </Stack>
                            <Stack direction="row" spacing={1} sx={{alignItems: "center", mt: 1}}>
                                <Typography sx={{color: "text.disabled", fontSize: 18, textDecoration: "line-through"}}>{r.totalBefore}</Typography>
                                <EastIcon fontSize="small" sx={{color: "text.disabled"}}/>
                                <Typography sx={{fontSize: 32, fontWeight: 800}}><CountUp from={r.totalBefore} to={r.totalAfter}/></Typography>
                            </Stack>
                            <Box sx={{
                                display: "inline-block", mt: 1, px: 1, py: 0.25, borderRadius: 1, fontWeight: 700,
                                color: "white", bgcolor: r.handScore > 0 ? "#2e7d32" : r.handScore < 0 ? "#c62828" : "#9e9e9e",
                            }}>
                                {signed(r.handScore)}
                            </Box>
                            <Typography component="span" variant="body2" sx={{ml: 1, color: scoreColor(0)}}>
                                hand {r.hand}p{r.isWinner ? " · mahjong" : ""}
                            </Typography>
                            <ProposalBadges badges={r.badges}/>
                        </Box>
                    </motion.div>
                </Grid>
            ))}
        </Grid>
    );
}
