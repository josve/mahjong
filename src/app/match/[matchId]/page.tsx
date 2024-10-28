import { getMatchById } from "@/lib/dbMatch";
import MatchChart from "@/components/match/matchChart";
import { Metadata } from "next";

interface PageProps {
  readonly params: {
    readonly matchId: string;
  };
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const match = await getMatchById(params.matchId);
  return {
    title: `${match.NAME} - Mahjong Master System`,
  };
}

export default async function Page({ params }: PageProps) {
  const match = await getMatchById(params.matchId);

  const matchDate = new Date(match.TIME);
  const isEditable =
    new Date().getTime() - matchDate.getTime() < 24 * 60 * 60 * 1000;

  return (
    <>
      <MatchChart
        matchId={params.matchId}
        autoReload={true}
      />
      {isEditable && (
        <div className="match-buttons-container">
          <a
            href={`/match/${params.matchId}/edit`}
            className="button"
          >
            Registrera resultat
          </a>
          <a
            href={`/scorecalculator`}
            className="button"
          >
            Poängräknare
          </a>
        </div>
      )}
    </>
  );
}
