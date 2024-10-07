import Connection from "@/lib/connection";

async function getTotalStatistics() {
  const connection = await Connection.getInstance().getConnection();
  try {
    const [result] = await connection.query(`
      SELECT 
        COUNT(DISTINCT Games.GAME_ID) as totalMatches,
        SUM(CASE WHEN IS_WINNER = 1 THEN 1 ELSE 0 END) as totalMahjongs,
        COUNT(distinct concat(ROUND, Games.GAME_ID)) as totalRounds
      FROM Hands INNER JOIN Games ON Hands.GAME_ID = Games.GAME_ID
    `);
    return result[0];
  } finally {
    connection.release();
  }
}

export default async function TotalStatisticsRow() {
  const stats = await getTotalStatistics();

  return (
    <div style={{ marginBottom: "20px", textAlign: "left", color: "#909090" }}>
      <p>
        Totalt {stats.totalMatches} matcher, {stats.totalMahjongs} mahjonger på{" "}
        {stats.totalRounds} omgångar
      </p>
    </div>
  );
}
