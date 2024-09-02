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
      <h1>Matcher</h1>
      <TotalStatisticsRow />
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "20px",
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
    </>
  );
}
