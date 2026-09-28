import React from "react";
import {Avatar, Box, Chip, Grid, Stack, Typography} from "@mui/material";
import {getPlayerResults, ProposalProps, scoreColor, signed} from "./playerResultData";
import ProposalBadges from "./ProposalBadges";

/** Proposal 3: the team colours from the match chart tie the cards to the chart lines above. */
export default function Proposal03TeamColors(props: ProposalProps) {
    const results = getPlayerResults(props);
    return (
        <Grid container spacing={2}>
            {results.map(r => (
                <Grid key={r.teamId} size={{xs: 12, sm: 6, md: 3}}>
                    <Box sx={{
                        borderRadius: 2, overflow: "hidden", height: "100%", bgcolor: "white",
                        boxShadow: r.isWinner ? `0 0 0 3px ${r.color}, 0 6px 16px rgba(0,0,0,0.12)` : "0 1px 4px rgba(0,0,0,0.12)",
                    }}>
                        <Box sx={{height: 8, bgcolor: r.color}}/>
                        <Box sx={{p: 2}}>
                            <Stack direction="row" spacing={1.5} sx={{alignItems: "center"}}>
                                <Avatar sx={{bgcolor: r.color, fontWeight: 700}}>{r.name.charAt(0)}</Avatar>
                                <Box sx={{flex: 1, minWidth: 0}}>
                                    <Typography variant="subtitle1" sx={{fontWeight: 700}} noWrap>{r.name}</Typography>
                                    <Typography variant="caption" color="text.secondary">{r.windName}</Typography>
                                </Box>
                                {r.isWinner && <Chip label="Mahjong" size="small" sx={{bgcolor: r.color, color: "white", fontWeight: 700}}/>}
                            </Stack>
                            <Stack direction="row" sx={{justifyContent: "space-between", alignItems: "flex-end", mt: 2}}>
                                <Box>
                                    <Typography variant="caption" color="text.secondary">Hand</Typography>
                                    <Typography variant="h6">{r.hand}p</Typography>
                                </Box>
                                <Box sx={{textAlign: "right"}}>
                                    <Typography variant="caption" color="text.secondary">Resultat</Typography>
                                    <Typography variant="h5" sx={{fontWeight: 700, color: scoreColor(r.handScore)}}>{signed(r.handScore)}</Typography>
                                </Box>
                            </Stack>
                            <ProposalBadges badges={r.badges}/>
                        </Box>
                    </Box>
                </Grid>
            ))}
        </Grid>
    );
}
