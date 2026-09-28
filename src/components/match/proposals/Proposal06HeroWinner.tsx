import React from "react";
import {Box, Chip, Grid, Stack, Typography} from "@mui/material";
import {getPlayerResults, ProposalProps, scoreColor, signed} from "./playerResultData";

/** Proposal 6: the round's winner gets a large header card, the others a smaller row below. */
export default function Proposal06HeroWinner(props: ProposalProps) {
    const results = getPlayerResults(props);
    const winner = results.find(r => r.isWinner);
    const others = results.filter(r => r !== winner).sort((a, b) => b.handScore - a.handScore);
    return (
        <Stack spacing={2}>
            {winner ? (
                <Box sx={{
                    borderRadius: 3, p: 3, color: "white",
                    background: "linear-gradient(120deg, rgb(229, 70, 70), rgb(117, 62, 39))",
                    display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 2,
                }}>
                    <Box>
                        <Typography variant="overline" sx={{color: "white", opacity: 0.85}}>Mahjong · {winner.windName}</Typography>
                        <Typography variant="h4" sx={{color: "white", fontWeight: 800}}>{winner.name}</Typography>
                        <Stack direction="row" spacing={1} sx={{mt: 1, flexWrap: "wrap"}}>
                            {winner.badges.map(b => (
                                <Chip key={b.id} icon={b.icon} label={b.label} size="small"
                                      sx={{bgcolor: "rgba(255,255,255,0.2)", color: "white", "& .MuiChip-icon": {color: "white"}}}/>
                            ))}
                        </Stack>
                    </Box>
                    <Stack direction="row" spacing={4}>
                        <Box sx={{textAlign: "center"}}>
                            <Typography sx={{color: "white", fontSize: 40, fontWeight: 800, lineHeight: 1}}>{winner.hand}p</Typography>
                            <Typography variant="caption" sx={{color: "white", opacity: 0.85}}>hand</Typography>
                        </Box>
                        <Box sx={{textAlign: "center"}}>
                            <Typography sx={{color: "white", fontSize: 40, fontWeight: 800, lineHeight: 1}}>{signed(winner.handScore)}</Typography>
                            <Typography variant="caption" sx={{color: "white", opacity: 0.85}}>poäng</Typography>
                        </Box>
                    </Stack>
                </Box>
            ) : (
                <Box sx={{borderRadius: 3, p: 3, bgcolor: "#f5f5f5"}}>
                    <Typography variant="h5">Ingen mahjong denna omgång</Typography>
                </Box>
            )}
            <Grid container spacing={2}>
                {others.map(r => (
                    <Grid key={r.teamId} size={{xs: 12, sm: 4}}>
                        <Box sx={{border: "1px solid #e0e0e0", borderRadius: 2, p: 1.5, display: "flex", justifyContent: "space-between", alignItems: "center"}}>
                            <Box>
                                <Typography sx={{fontWeight: 600}}>{r.name}</Typography>
                                <Typography variant="caption" color="text.secondary">{r.windName} · {r.hand}p</Typography>
                            </Box>
                            <Typography variant="h6" sx={{fontWeight: 700, color: scoreColor(r.handScore)}}>{signed(r.handScore)}</Typography>
                        </Box>
                    </Grid>
                ))}
            </Grid>
        </Stack>
    );
}
