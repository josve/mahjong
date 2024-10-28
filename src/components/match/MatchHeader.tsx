import { getMatchById } from "@/lib/dbMatch";
import { 
formatDate, 
capitalize 
} from "@/lib/formatting";

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
      <div className="label">
        {capitalize(formatDate(match.TIME))}
      </div>
      {match.COMMENT && (
        <div className="label">
          {match.COMMENT}
        </div>
      )}
    </div>
  );
}
