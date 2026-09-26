import { getMatchById } from "@/lib/dbMatch";
import MatchChart from "@/components/match/matchChart";
import { Metadata } from "next";
import {auth} from "@/auth";

interface PageProps {
  readonly params: Promise<{
    readonly matchId: string;
  }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { matchId } = await params;
  const match = await getMatchById(matchId);
  return {
    title: `${match.NAME} - Mahjong Master System`,
  };
}

export default async function Page({ params }: PageProps) {
  const { matchId } = await params;
  const match = await getMatchById(matchId);

  const matchDate = new Date(match.TIME);
  const isEditable =
    new Date().getTime() - matchDate.getTime() < 24 * 60 * 60 * 1000;

  let allowRegister = true;
  if (process.env.REQUIRE_LOGIN) {
    const session = await auth();
    allowRegister = !!session && !!session.user;
  }

  return (
    <>
      <MatchChart
        matchId={matchId}
        isEditable={isEditable}
        autoReload={true}
      />
      {isEditable && (
        <div className="match-buttons-container">
          {allowRegister &&
          <a
            href={`/match/${matchId}/edit`}
            className="button"
          >
            Registrera resultat
          </a>}
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
