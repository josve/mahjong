import React from "react";
import {Box, Stack, Typography} from "@mui/material";
import {getPlayerResults, ProposalProps, SCORE_GREEN, SCORE_RED, signed} from "./playerResultData";
import ProposalBadges from "./ProposalBadges";

/** Proposal 5: diverging bars show at a glance who won and who paid, and how much. */
export default function Proposal05ScoreBars(props: ProposalProps) {
    const results = getPlayerResults(props);
    const max = Math.max(1, ...results.map(r => Math.abs(r.handScore)));
    return (
        <Stack spacing={1.25} sx={{border: "1px solid #e0e0e0", borderRadius: 2, p: 2}}>
            {results.map(r => {
                const width = `${(Math.abs(r.handScore) / max) * 50}%`;
                const positive = r.handScore >= 0;
                return (
                    <Box key={r.teamId} sx={{display: "grid", gridTemplateColumns: "140px 1fr 64px", alignItems: "center", gap: 1.5}}>
                        <Box>
                            <Typography variant="body1" sx={{fontWeight: r.isWinner ? 700 : 500}} noWrap>
                                {r.isWinner ? "🀄 " : ""}{r.name}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">{r.windName} · {r.hand}p</Typography>
                        </Box>
                        <Box sx={{position: "relative", height: 26, bgcolor: "#f5f5f5", borderRadius: 1}}>
                            <Box sx={{position: "absolute", left: "50%", top: -4, bottom: -4, width: "2px", bgcolor: "#9e9e9e"}}/>
                            <Box sx={{
                                position: "absolute", top: 3, bottom: 3, width,
                                left: positive ? "50%" : undefined, right: positive ? undefined : "50%",
                                bgcolor: positive ? SCORE_GREEN : SCORE_RED,
                                borderRadius: positive ? "0 4px 4px 0" : "4px 0 0 4px",
                            }}/>
                        </Box>
                        <Typography sx={{fontWeight: 700, textAlign: "right", color: positive ? SCORE_GREEN : SCORE_RED}}>
                            {signed(r.handScore)}
                        </Typography>
                        {r.badges.length > 0 && (
                            <Box sx={{gridColumn: "2 / 4", mt: -1}}>
                                <ProposalBadges badges={r.badges} justify="flex-start" mt={0}/>
                            </Box>
                        )}
                    </Box>
                );
            })}
        </Stack>
    );
}
