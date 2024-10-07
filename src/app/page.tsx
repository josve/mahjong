import MatchGridItem from "@/components/matchGridItem";
import TotalStatisticsRow from "@/components/totalStatisticsRow";
import Connection from "@/lib/connection";

async function getAllMatches(): Promise<any> {
  const connection = await Connection.getInstance().getConnection(); // Get a connection
  try {
    const [matches] = await connection.query(
      "SELECT GAME_ID FROM Games ORDER BY TIME DESC"
    );
    return matches;
  } finally {
    connection.release(); // Ensure the connection is released
  }
}

export default async function Home() {
  const matches = await getAllMatches();

  return (
    <>
      <div style={{ backgroundColor: "rgb(250, 250, 250)", padding: "20px" }}>
        <div style={{ backgroundColor: "white", padding: "20px", boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)" }}>
          <h1 style={{ margin: 0, color: "#943030", fontFamily: "HelveticaNeueLight, Helvetica, tahoma, arial", fontSize: "42px", textAlign: "left" }}>
            Matcher
          </h1>
          <TotalStatisticsRow />
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "20px",
              marginTop: "20px",
            }}
          >
            <>
              {matches.map((match: { GAME_ID: string }) => (
                <MatchGridItem
                  key={match.GAME_ID}
                  id={match.GAME_ID}
                />
              ))}
            </>
          </div>
        </div>
      </div>
    </>
  );
}
