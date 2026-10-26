import { getMatchById } from "@/lib/dbMatch";
import MatchChart from "@/components/match/matchChart";
import { Metadata } from "next";
import {auth} from "@/auth";
import {getAutotableGameUrl} from "@/lib/autotable";

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

  const session = await auth();
  const isLoggedIn = !!session && !!session.user;
  const allowRegister = !process.env.REQUIRE_LOGIN || isLoggedIn;
  const autotableUrl = isLoggedIn
    ? getAutotableGameUrl(match.AUTOTABLE_GAME_ID)
    : null;

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
          {autotableUrl &&
          <a
            href={autotableUrl}
            className="button"
            target="_blank"
            rel="noopener noreferrer"
          >
            Till spelet
          </a>}
        </div>
      )}
    </>
  );
}
