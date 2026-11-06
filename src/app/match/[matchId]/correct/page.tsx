import { getMatchById, getHandsByGameId, getTeamIdToName } from "@/lib/dbMatch";
import RoundDisplay from "@/components/RoundDisplay";
import { Metadata } from "next";
import {auth} from "@/auth";
import { getTranslations } from "next-intl/server";
import {Hand, IdToName} from "@/types/db";

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
  const t = await getTranslations();
  return {
    title: t("app.pageTitle", { title: t("match.correctResultFor", { name: match.NAME }) }),
  };
}

export default async function EditPage({ params }: PageProps) {
  const { matchId } = await params;
  const t = await getTranslations();

  if (process.env.REQUIRE_LOGIN) {
    const session = await auth();

    if (!session || !session.user) {
      return <p>{t("common.mustBeLoggedIn")}</p>;
    }
  }

  const match = await getMatchById(matchId);
  const hands = await getHandsByGameId(matchId);

  const teamIdToName = await getTeamIdToName();
  const relevantTeamIds = [
    match.TEAM_ID_1,
    match.TEAM_ID_2,
    match.TEAM_ID_3,
    match.TEAM_ID_4,
  ];
  const relevantTeams: IdToName = Object.fromEntries(
    Object.entries(teamIdToName).filter(([teamId]) =>
      relevantTeamIds.includes(teamId)
    )
  );

  const matchDate = new Date(match.TIME);
  const isEditable =
    new Date().getTime() - matchDate.getTime() < 24 * 60 * 60 * 1000;

  const rounds = hands.reduce((acc: { [round: number]: Hand[]  }, hand) => {
    if (!acc[hand.ROUND]) {
      acc[hand.ROUND] = [];
    }
    acc[hand.ROUND].push(hand);
    return acc;
  }, {});

  return (
    <div style={{ padding: "20px" }}>
      <h1>{t("match.correctResultFor", { name: match.NAME })}</h1>
      {isEditable ? (
        Object.entries(rounds).map(
          ([round, hands]: [string, Hand[]]) =>
            round !== "0" && (
              <RoundDisplay
                key={round}
                round={round}
                hands={hands}
                matchId={matchId}
                teamIdToName={relevantTeams}
              />
            )
        )
      ) : (
        <p
          style={{
            color: "var(--grey-color)",
            textAlign: "center",
            paddingTop: "20px",
            paddingBottom: "20px",
          }}
        >
          {t("common.matchTooOld")}
        </p>
      )}
    </div>
  );
}
