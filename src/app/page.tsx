import MatchGridItem from "@/components/matchGridItem";
import TotalStatisticsRow from "@/components/totalStatisticsRow";
import Connection from "@/lib/connection";
import Link from "next/link";

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
      <div style={{ backgroundColor: "rgb(250, 250, 250)", padding: "20px" }}>
        <div style={{ backgroundColor: "white", padding: "20px", boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
            <h1 style={{ margin: 0, color: "#943030", fontFamily: "HelveticaNeueLight, Helvetica, tahoma, arial", fontSize: "42px", textAlign: "left" }}>
              Matcher
            </h1>
            <Link href="/match/new" passHref>
              <button style={{
                backgroundColor: "#943030",
                color: "white",
                border: "none",
                padding: "10px 20px",
                borderRadius: "5px",
                cursor: "pointer",
                fontSize: "16px",
                fontWeight: "bold"
              }}>
                Skapa ny match
              </button>
            </Link>
          </div>
          <TotalStatisticsRow/>
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
      <style jsx>{`
        @media (max-width: 768px) {
          div {
            padding: 10px;
          }
          h1 {
            font-size: 32px;
          }
          button {
            padding: 8px 16px;
            font-size: 14px;
          }
          .grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </>
  );
}
