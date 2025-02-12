import { getMatchById, getHandsByGameId, getTeamIdToName } from "@/lib/dbMatch";
import RoundDisplay from "@/components/RoundDisplay";
import { Metadata } from "next";
import {auth} from "@/auth";
import {Hand, IdToName} from "@/types/db";

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
    title: `Korrigera resultat för ${match.NAME} - Mahjong Master System`,
  };
}

export default async function EditPage({ params }: PageProps) {

  if (process.env.REQUIRE_LOGIN) {
    const session = await auth();

    if (!session || !session.user) {
      return <p>Du måste vara inloggad för att se denna sida.</p>;
    }
  }

  const match = await getMatchById(params.matchId);
  const hands = await getHandsByGameId(params.matchId);

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
      <h1>Korrigera resultat för {match.NAME}</h1>
      {isEditable ? (
        Object.entries(rounds).map(
          ([round, hands]: [string, Hand[]]) =>
            round !== "0" && (
              <RoundDisplay
                key={round}
                round={round}
                hands={hands}
                matchId={params.matchId}
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
          Matchen är för gammal för att göra ändringar.
        </p>
      )}
    </div>
  );
}
