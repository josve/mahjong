import { getMatchById } from "@/lib/dbMatch";
import MatchChart from "@/components/match/matchChart";
import { Metadata } from "next";
import {auth} from "@/auth";
import {getAutotableGameUrl} from "@/lib/autotable";
import { getTranslations } from "next-intl/server";

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
  const t = await getTranslations("app");
  return {
    title: t("pageTitle", { title: match.NAME }),
  };
}

export default async function Page({ params }: PageProps) {
  const { matchId } = await params;
  const match = await getMatchById(matchId);
  const t = await getTranslations("match");

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
            {t("registerResult")}
          </a>}
          <a
            href={`/scorecalculator`}
            className="button"
          >
            {t("scoreCalculator")}
          </a>
          {autotableUrl &&
          <a
            href={autotableUrl}
            className="button"
            target="_blank"
            rel="noopener noreferrer"
          >
            {t("toGame")}
          </a>}
        </div>
      )}
    </>
  );
}
