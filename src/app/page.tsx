import TotalStatisticsRow from "@/components/matches/totalStatisticsRow";
import Link from "next/link";
import { Box } from "@mui/material";
import Grid from '@mui/material/Grid2';
import fetchMatches, { getAllMatches} from "@/lib/fetchMatches";
import {auth} from "@/auth";
import {GameWithHands} from "@/types/db";
import MatchGridItemClient from "@/components/matches/MatchGridItemClient";

export const revalidate = 60;

export default async function Home() {
    const matches = await fetchMatches(true);
    const numMatches = matches.length;

    let allowCreate = true;
    if (process.env.REQUIRE_LOGIN) {
        const session = await auth();
        allowCreate = !!session && !!session.user;
    }

    return (
        <>
            <Box className="matches-header">
                <h1>
                    Matcher
                </h1>
                {allowCreate &&
                <Box sx={{display: {xs: "none", md: "block"}}}
                >
                    <Link
                        href="/match/new"
                        passHref
                    >
                        <button className="button create-match-button">Skapa ny match</button>
                    </Link>
                </Box>}
            </Box>
            <TotalStatisticsRow/>
            <Grid
                container
                spacing={3}
                sx={{marginTop: "20px"}}
            >
                {" "}
                {matches.map((match: GameWithHands, index) => (
                    <Grid
                        size={{ xs: 12, sm: 6}}
                        key={match.GAME_ID}
                    >
                        {" "}
                        <MatchGridItemClient index={numMatches - index} match={match}/>
                    </Grid>
                ))}
            </Grid>
        </>
    );
}
