import { getMatchById } from "@/lib/dbMatch";
import { 
formatDate, 
capitalize 
} from "@/lib/formatting";
import { getTranslations } from "next-intl/server";

interface Props {
  readonly numRounds: number;
  readonly matchId: string;
}

export default async function MatchHeader({ numRounds, matchId }: Props) {
  const match = await getMatchById(matchId);
  const t = await getTranslations("common");

  return (
    <div>
      <div className="multi-title-header">
        <h1>{match.NAME}</h1>
        <h2 style={{ textAlign: "left" }}>{t("rounds", { count: numRounds })}</h2>
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
