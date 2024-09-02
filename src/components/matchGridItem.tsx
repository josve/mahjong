import db from "@/lib/db";

async function getMatchById(id: string) {
  const connection = await db.getConnection(); // Get a connection
  try {
    const [match] = await connection.query(
      "SELECT * FROM Games WHERE GAME_ID = ?",
      [id]
    );
    return match[0];
  } finally {
    connection.release(); // Ensure the connection is released
  }
}

export default async function MatchGridItem({ id }: { id: string }) {
  const match = await getMatchById(id);
  const name = match.NAME;
  const description = match.COMMENT;
  const time = match.TIME;
  console.log(description);
  return (
    <div
      style={{ border: "1px solid #ccc", padding: "10px", borderRadius: "5px" }}
    >
      <h3>{name}</h3>
      <h2>{description}</h2>
      <p>
        <strong>Date:</strong> {new Date(time).toLocaleDateString()}
      </p>
    </div>
  );
}
