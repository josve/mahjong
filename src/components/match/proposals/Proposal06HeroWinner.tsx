import React from "react";
import {Box, Chip, Grid, Stack, Typography} from "@mui/material";
import {getPlayerResults, PlayerResult, ProposalProps, scoreColor, signed} from "./playerResultData";
import ProposalBadges from "./ProposalBadges";

function WinnerCard({r}: { r: PlayerResult }) {
    return (
        <Box sx={{
            borderRadius: 3, p: 2, height: "100%", color: "white",
            background: "linear-gradient(135deg, rgb(229, 70, 70), rgb(117, 62, 39))",
            boxShadow: "0 8px 20px rgba(148, 48, 48, 0.35)",
        }}>
            <Typography variant="overline" sx={{color: "white", opacity: 0.85, lineHeight: 1.5}}>Mahjong · {r.windName}</Typography>
            <Typography variant="h5" sx={{color: "white", fontWeight: 800}}>{r.name}</Typography>
            <Stack direction="row" spacing={3} sx={{mt: 1}}>
                <Box>
                    <Typography sx={{color: "white", fontSize: 32, fontWeight: 800, lineHeight: 1}}>{signed(r.handScore)}</Typography>
                    <Typography variant="caption" sx={{color: "white", opacity: 0.85}}>poäng</Typography>
                </Box>
                <Box>
                    <Typography sx={{color: "white", fontSize: 32, fontWeight: 800, lineHeight: 1}}>{r.hand}p</Typography>
                    <Typography variant="caption" sx={{color: "white", opacity: 0.85}}>hand</Typography>
                </Box>
            </Stack>
            <Box sx={{display: "flex", flexWrap: "wrap", gap: 0.5, mt: 1}}>
                {r.badges.map(b => (
                    <Chip key={b.id} icon={b.icon} label={b.label} size="small"
                          sx={{bgcolor: "rgba(255,255,255,0.2)", color: "white", "& .MuiChip-icon": {color: "white"}}}/>
                ))}
            </Box>
        </Box>
    );
}

function OtherCard({r}: { r: PlayerResult }) {
    return (
        <Box sx={{border: "1px solid #e0e0e0", borderRadius: 3, p: 2, height: "100%", bgcolor: "#fafafa"}}>
            <Typography variant="overline" color="text.secondary" sx={{lineHeight: 1.5}}>{r.windName}</Typography>
            <Typography variant="h6">{r.name}</Typography>
            <Typography sx={{fontSize: 24, fontWeight: 700, color: scoreColor(r.handScore)}}>{signed(r.handScore)}</Typography>
            <Typography variant="body2" color="text.secondary">Hand {r.hand}p</Typography>
            <ProposalBadges badges={r.badges} justify="flex-start"/>
        </Box>
    );
}

/** Proposal 6: the round's winner stays in its place but stands out in the app's colours, the others are toned down. */
export default function Proposal06HeroWinner(props: ProposalProps) {
    const results = getPlayerResults(props);
    return (
        <Grid container spacing={2}>
            {results.map(r => (
                <Grid key={r.teamId} size={{xs: 12, sm: 6, md: 3}}>
                    {r.isWinner ? <WinnerCard r={r}/> : <OtherCard r={r}/>}
                </Grid>
            ))}
        </Grid>
    );
}
