import React from "react";
import {Box, Table, TableBody, TableCell, TableHead, TableRow, Typography} from "@mui/material";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import {getPlayerResults, ProposalProps, scoreColor, signed} from "./playerResultData";
import ProposalBadges from "./ProposalBadges";

/** Proposal 4: a dense table row per team, in the same order as today. Fits mobile and makes "Alla omgångar" much shorter. */
export default function Proposal04CompactTable(props: ProposalProps) {
    const results = getPlayerResults(props);
    return (
        <Box sx={{border: "1px solid #e0e0e0", borderRadius: 2, overflow: "hidden"}}>
            <Table size="small">
                <TableHead sx={{bgcolor: "#fafafa"}}>
                    <TableRow>
                        <TableCell>#</TableCell>
                        <TableCell>Lag</TableCell>
                        <TableCell>Vind</TableCell>
                        <TableCell align="right">Hand</TableCell>
                        <TableCell align="right">Resultat</TableCell>
                        <TableCell align="right">Totalt</TableCell>
                        <TableCell>Märken</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {results.map(r => (
                        <TableRow key={r.teamId} sx={{bgcolor: r.isWinner ? "#e8f5e9" : undefined}}>
                            <TableCell sx={{fontWeight: 700}}>{r.rankAfter}</TableCell>
                            <TableCell>
                                <Box sx={{display: "flex", alignItems: "center", gap: 1}}>
                                    <Box sx={{width: 10, height: 10, borderRadius: "50%", bgcolor: r.color}}/>
                                    <Typography variant="body2" sx={{fontWeight: r.isWinner ? 700 : 400}}>{r.name}</Typography>
                                    {r.isWinner && <EmojiEventsIcon fontSize="small" sx={{color: "#c9a227"}}/>}
                                </Box>
                            </TableCell>
                            <TableCell>{r.windChar} {r.windName}</TableCell>
                            <TableCell align="right">{r.hand}p</TableCell>
                            <TableCell align="right" sx={{fontWeight: 700, color: scoreColor(r.handScore)}}>{signed(r.handScore)}</TableCell>
                            <TableCell align="right">{r.totalAfter}</TableCell>
                            <TableCell>
                                <ProposalBadges badges={r.badges} justify="flex-start" mt={0}/>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </Box>
    );
}
