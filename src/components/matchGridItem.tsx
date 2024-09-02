import Link from "next/link";
import Connection from "@/lib/connection";

async function getMatchById(id: string): Promise<any> {
  const connection = await Connection.getInstance().getConnection();
  try {
    const [rows] = await connection.query(
      "SELECT *, (SELECT COUNT(*) From Games g where g.TIME < Games.TIME) as GAME_IDX FROM Games WHERE GAME_ID = ?",
      [id]
    );
    return rows[0];
  } finally {
    connection.release();
  }
}

async function getHandsByGameId(id: string): Promise<any> {
  const connection = await Connection.getInstance().getConnection();
  try {
    const [hands] = await connection.query(
      "SELECT * FROM Hands WHERE GAME_ID = ? ORDER BY ROUND ASC",
      [id]
    );
    return hands;
  } finally {
    connection.release();
  }
}

export default async function MatchGridItem({ id }: { id: string }) {
  const match = await getMatchById(id);
  const hands = await getHandsByGameId(id);

  const name = match.NAME;
  const time = match.TIME;

  // generate a string with the time for the first and last rounds like (19:28-21:42)
  const firstRound = hands[0].TIME;
  const lastRound = hands[hands.length - 1].TIME;

  // Find the number of rounds, this is the number of hands divided by 4
  const numberOfRounds = Math.floor(hands.length / 4 - 1);

  // Update time format
  const formatTime = (date: Date) =>
    date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  const timeString = `${formatTime(new Date(firstRound))}-${formatTime(
    new Date(lastRound)
  )}`;

  return (
    <div
      style={{ border: "1px solid #ccc", padding: "10px", borderRadius: "5px" }}
    >
      <div>
        {new Date(time).toLocaleDateString()} ({timeString})
      </div>
      <Link href={`/match/${id}`}>
        #{match.GAME_IDX}. {name}
      </Link>
      <p>{numberOfRounds} omgångar,</p>
    </div>
  );
}
