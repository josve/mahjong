import React from "react";
import {Box, Table, TableBody, TableCell, TableHead, TableRow, Tooltip, Typography} from "@mui/material";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import {byRank, getPlayerResults, ProposalProps, scoreColor, signed} from "./playerResultData";

/** Proposal 4: a dense table row per team. Fits mobile and makes "Alla omgångar" much shorter. */
export default function Proposal04CompactTable(props: ProposalProps) {
    const results = getPlayerResults(props).sort(byRank);
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
                                <Box sx={{display: "flex", gap: 0.5}}>
                                    {r.badges.map(b => (
                                        <Tooltip key={b.id} title={b.label}>
                                            <Box sx={{display: "flex", color: `${b.color}.main`, "& svg": {fontSize: 18}}}>{b.icon}</Box>
                                        </Tooltip>
                                    ))}
                                </Box>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </Box>
    );
}
