"use client";

import Link from "next/link";
import {Box, Card, CardActionArea, CardContent, Typography} from "@mui/material";
import {getMatchCardData, ProposalProps, WIND_KANJI} from "./matchCardData";

/** Förslag 8: Mahjongbrickor — varje lag visas som en mahjongbricka med sin vind, på en filtgrön spelduk. */
export default function Proposal08Tiles(props: ProposalProps) {
    const data = getMatchCardData(props);

    return (
        <Card sx={{background: "radial-gradient(circle at 30% 20%, #1f7a4d, #0f4f31)", color: "#fff", "& .MuiTypography-root": {color: "inherit"}}}>
            <CardActionArea component={Link} href={`/match/${props.match.GAME_ID}`}>
                <CardContent>
                    <Box sx={{display: "flex", justifyContent: "space-between", alignItems: "baseline"}}>
                        <Typography sx={{fontSize: 20, fontWeight: 700}}>#{props.index} {data.name}</Typography>
                        <Typography sx={{opacity: 0.8, fontSize: 13}}>{data.rounds} omgångar</Typography>
                    </Box>
                    <Typography sx={{opacity: 0.8, fontSize: 13}}>{data.dateLabel}</Typography>
                    <Box sx={{display: "flex", gap: 1.5, mt: 2, justifyContent: "space-between"}}>
                        {data.teams.map(team => (
                            <Box key={team.teamId} sx={{flex: 1, textAlign: "center"}}>
                                <Box sx={{
                                    mx: "auto", width: 56, height: 74, borderRadius: "8px",
                                    background: "linear-gradient(180deg, #fffdf6, #efe7d3)",
                                    boxShadow: "0 4px 0 #c9b98f, 0 6px 10px rgba(0,0,0,0.35)",
                                    display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                                    color: team.rank === 1 ? "#b3261e" : "#1b3a2a",
                                }}>
                                    <Typography sx={{fontSize: 26, lineHeight: 1, fontWeight: 700, color: "inherit"}}>{WIND_KANJI[team.wind]}</Typography>
                                    <Typography sx={{fontSize: 13, fontWeight: 700, color: "inherit", fontVariantNumeric: "tabular-nums"}}>{team.score}</Typography>
                                </Box>
                                <Typography sx={{mt: 1.25, fontSize: 13, fontWeight: team.rank === 1 ? 700 : 400}} noWrap>
                                    {team.rank === 1 ? "👑 " : ""}{team.name}
                                </Typography>
                            </Box>
                        ))}
                    </Box>
                </CardContent>
            </CardActionArea>
        </Card>
    );
}
