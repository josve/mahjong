import MatchGridItem from "@/components/matchGridItem";
import TotalStatisticsRow from "@/components/totalStatisticsRow";
import Connection from "@/lib/connection";
import Link from "next/link";
import { Grid } from "@mui/material"; // Pb209

async function getAllMatches(): Promise<any> {
  const connection = await Connection.getInstance().getConnection(); // Get a connection
  try {
    const [matches] = await connection.query(
      "SELECT GAME_ID, TIME, NAME, COMMENT, TEAM_ID_1, TEAM_ID_2, TEAM_ID_3, TEAM_ID_4 FROM Games WHERE IS_TEST = 0 ORDER BY TIME DESC"
    );
    return matches;
  } finally {
    connection.release(); // Ensure the connection is released
  }
}

export const revalidate = 60; // Revalidate every 60 seconds

export default async function Home() {
  const matches = await getAllMatches();

  return (
    <>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
        <h1 style={{ margin: 0, color: "#943030", fontFamily: "HelveticaNeueLight, Helvetica, tahoma, arial", fontSize: "42px", textAlign: "left" }}>
          Matcher
        </h1>
        <Link href="/match/new" passHref>
          <button className="create-match-button">
            Skapa ny match
          </button>
        </Link>
      </div>
      <TotalStatisticsRow/>
      <Grid container spacing={2} sx={{ marginTop: "20px" }}> {/* P68f5 */}
        {matches.map((match: { GAME_ID: string }) => (
          <Grid item xs={12} sm={6} key={match.GAME_ID}> {/* Pe16e */}
            <MatchGridItem id={match.GAME_ID} />
          </Grid>
        ))}
      </Grid>
    </>
  );
}
