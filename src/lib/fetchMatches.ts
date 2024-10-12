import Connection from "@/lib/connection";

export default async function fetchMatches(timeRange: string) {
  const connection = await Connection.getInstance().getConnection();
  try {
    let query = "SELECT * FROM Games";
    if (timeRange === "ny tid") {
      query += " WHERE TIME >= '2014-10-01'";
    } else if (timeRange === "nuvarande år") {
      const currentYear = new Date().getFullYear();
      query += ` WHERE YEAR(TIME) = ${currentYear}`;
    }
    const [games] = await connection.query(query);

    // Fetch hands for each game
    for (const game of games) {
      const [hands] = await connection.query(
        "SELECT * FROM Hands WHERE GAME_ID = ? ORDER BY ROUND ASC",
        [game.GAME_ID]
      );
      game.hands = hands;
    }

    return games;
  } finally {
    connection.release();
  }
}
