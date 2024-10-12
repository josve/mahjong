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
    const [result] = await connection.query(query);
    return result;
  } finally {
    connection.release();
  }
}
