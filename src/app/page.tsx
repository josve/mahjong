import MatchGridItem from "@/components/matches/matchGridItem";
import TotalStatisticsRow from "@/components/matches/totalStatisticsRow";
import Link from "next/link";
import { Box } from "@mui/material";
import Grid from '@mui/material/Grid2';
import { getAllMatches} from "@/lib/fetchMatches";
import {auth} from "@/auth";

export const revalidate = 60;

export default async function Home() {
    const matches = await getAllMatches();

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
                {matches.map((match: { GAME_ID: string }) => (
                    <Grid
                        size={{ xs: 12, sm: 6}}
                        key={match.GAME_ID}
                    >
                        {" "}
                        <MatchGridItem id={match.GAME_ID}/>
                    </Grid>
                ))}
            </Grid>
        </>
    );
}
