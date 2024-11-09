import MatchGridItem from "@/components/matchGridItem";
import TotalStatisticsRow from "@/components/totalStatisticsRow";
import Link from "next/link";
import { Box } from "@mui/material";
import Grid from '@mui/material/Grid2';
import { getAllMatches} from "@/lib/fetchMatches";

export const revalidate = 60;

export default async function Home() {
    const matches = await getAllMatches();

    return (
        <>
            <Box className="matches-header">
                <h1>
                    Matcher
                </h1>
                <Box sx={{display: {xs: "none", ms: "block"}}}
                >
                    <Link
                        href="/match/new"
                        passHref
                    >
                        <button className="button create-match-button">Skapa ny match</button>
                    </Link>
                </Box>
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
