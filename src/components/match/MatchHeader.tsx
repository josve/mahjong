import { getMatchById } from "@/lib/dbMatch";

interface Props {
  numRounds: number;
  matchId: string;
}

export default async function MatchHeader({ numRounds, matchId }: Props) {
  const match = await getMatchById(matchId);

  return (
    <div>
      <div className="multi-title-header">
        <h1>{match.NAME}</h1>
        <h2 style={{ textAlign: "left" }}>{numRounds} omgångar</h2>
      </div>
      <h3
        className="grey-text"
        style={{
          textAlign: "left",
        }}
      >
        Datum {new Date(match.TIME).toLocaleDateString("sv-SE")}
      </h3>
      {match.COMMENT && (
        <div
          style={{
            paddingBottom: "10px",
            paddingTop: "10px",
          }}
        >
          {<p>Kommentar: {match.COMMENT}</p>}
        </div>
      )}
    </div>
  );
}
