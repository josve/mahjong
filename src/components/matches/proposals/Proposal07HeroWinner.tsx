"use client";

import Link from "next/link";
import {Box, Card, CardActionArea, Typography} from "@mui/material";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import {formatDelta, getMatchCardData, ProposalProps} from "./matchCardData";

/** Förslag 7: Vinnaren i fokus — ett gradienthuvud i appens färger lyfter fram vinnaren; övriga lag i en rad under. */
export default function Proposal07HeroWinner(props: ProposalProps) {
    const data = getMatchCardData(props);
    const [winner, ...rest] = data.teams;

    return (
        <Card sx={{overflow: "hidden"}}>
            <CardActionArea component={Link} href={`/match/${props.match.GAME_ID}`}>
                <Box sx={{p: 2, color: "#fff", "& .MuiTypography-root": {color: "inherit"}, background: "linear-gradient(135deg, rgb(229, 70, 70), rgb(117, 62, 39))"}}>
                    <Typography sx={{fontSize: 12, opacity: 0.85, textTransform: "uppercase", letterSpacing: 1}}>
                        #{props.index} {data.name} · {data.dateLabel}
                    </Typography>
                    <Box sx={{display: "flex", alignItems: "center", gap: 1.5, mt: 1}}>
                        <EmojiEventsIcon sx={{fontSize: 40, color: "#f5d36b"}}/>
                        <Box sx={{flex: 1}}>
                            <Typography sx={{fontSize: 24, fontWeight: 700, lineHeight: 1.1}}>{winner.name}</Typography>
                            <Typography sx={{opacity: 0.9}}>{winner.wins} vunna händer · största hand {winner.biggestHand}</Typography>
                        </Box>
                        <Box sx={{textAlign: "right"}}>
                            <Typography sx={{fontSize: 30, fontWeight: 700, lineHeight: 1}}>{winner.score}</Typography>
                            <Typography sx={{opacity: 0.9}}>{formatDelta(winner.delta)}</Typography>
                        </Box>
                    </Box>
                </Box>
                <Box sx={{display: "grid", gridTemplateColumns: "repeat(3, 1fr)", bgcolor: "#fff"}}>
                    {rest.map(team => (
                        <Box key={team.teamId} sx={{p: 1.5, textAlign: "center", "&:not(:last-of-type)": {borderRight: "1px solid #eee"}}}>
                            <Typography variant="body2">{team.rank}. plats</Typography>
                            <Typography sx={{fontWeight: 700, color: "text.primary"}} noWrap>{team.name}</Typography>
                            <Typography sx={{fontVariantNumeric: "tabular-nums"}}>{team.score}</Typography>
                        </Box>
                    ))}
                </Box>
            </CardActionArea>
        </Card>
    );
}
