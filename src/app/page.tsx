import MatchGridItem from "@/components/matchGridItem";
import TotalStatisticsRow from "@/components/totalStatisticsRow";
import Link from "next/link";
import { Grid } from "@mui/material";
import { getAllMatches} from "@/lib/fetchMatches";

export const revalidate = 60;

export default async function Home() {
  const matches = await getAllMatches();

  return (
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px",
        }}
      >
        <h1>
          Matcher
        </h1>
        <Link
          href="/match/new"
          passHref
        >
          <button className="create-match-button">Skapa ny match</button>
        </Link>
      </div>
      <TotalStatisticsRow />
      <Grid
        container
        spacing={3}
        sx={{ marginTop: "20px" }}
      >
        {" "}
        {matches.map((match: { GAME_ID: string }) => (
          <Grid
            item
            xs={12}
            sm={6}
            key={match.GAME_ID}
          >
            {" "}
            <MatchGridItem id={match.GAME_ID} />
          </Grid>
        ))}
      </Grid>
    </>
  );
}
