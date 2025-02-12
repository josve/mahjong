import TotalStatisticsRow from "@/components/matches/totalStatisticsRow";
import Link from "next/link";
import { Box } from "@mui/material";
import Grid from '@mui/material/Grid2';
import fetchMatches from "@/lib/fetchMatches";
import {auth} from "@/auth";
import {GameWithHands} from "@/types/db";
import MatchGridItemClient from "@/components/matches/MatchGridItemClient";
import {getTeamIdToName} from "@/lib/dbMatch";
import {getNextUpcomingGame} from "@/lib/db/upcomingGame";
import UpcomingGameCard from "@/components/matches/UpcomingGameCard";

export const revalidate = 60;

export default async function Home() {
    const matches = await fetchMatches(true);
    const idToName = await getTeamIdToName();
    const upcomingGame = await getNextUpcomingGame();
    const numMatches = matches.length;

    const session = await auth();
    let allowCreate = true;
    if (process.env.REQUIRE_LOGIN) {
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
                {upcomingGame && (
                    <Grid  size={{ xs: 12, sm: 6}} key={`upcoming-game-${upcomingGame.id}`}>
                        <UpcomingGameCard session={session} upcomingGame={upcomingGame} />
                    </Grid>
                )}

                {" "}
                {matches.map((match: GameWithHands, index) => (
                    <Grid
                        size={{ xs: 12, sm: 6}}
                        key={match.GAME_ID}
                    >
                        {" "}
                        <MatchGridItemClient index={numMatches - index} idToName={idToName} match={match}/>
                    </Grid>
                ))}
            </Grid>
        </>
    );
}
