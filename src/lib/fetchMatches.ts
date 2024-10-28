import Connection from "@/lib/connection";

export async function getAllMatches(): Promise<any> {
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

export default async function fetchMatches(timeRange: string) {
  const connection = await Connection.getInstance().getConnection();
  try {
    let query = "SELECT * FROM Games WHERE IS_TEST = 0";
    if (timeRange === "ny tid") {
      query += " AND TIME >= '2014-10-01'";
    } else if (timeRange === "nuvarande år") {
      const currentYear = new Date().getFullYear();
      query += ` AND YEAR(TIME) = ${currentYear}`;
    }
    // For "all tid", we don't need to add any additional conditions
    query += " ORDER BY TIME ASC";
    
    const [games]: any = await connection.query(query);

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
