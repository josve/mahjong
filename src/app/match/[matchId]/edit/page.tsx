import { getMatchById, getHandsByGameId, getTeamIdToName } from "@/lib/dbMatch";
import RoundDisplay from "@/components/RoundDisplay";

interface PageProps {
  params: {
    matchId: string;
  };
}

export default async function EditPage({ params }: PageProps) {
  const match = await getMatchById(params.matchId);
  const hands = await getHandsByGameId(params.matchId);

  const teamIdToName = (await getTeamIdToName()) || {};
  const relevantTeamIds = [
    match.TEAM_ID_1,
    match.TEAM_ID_2,
    match.TEAM_ID_3,
    match.TEAM_ID_4,
  ];
  const relevantTeams: any = Object.fromEntries(
    Object.entries(teamIdToName).filter(([teamId]) =>
      relevantTeamIds.includes(teamId)
    )
  );

  const matchDate = new Date(match.TIME);
  const isEditable = (new Date().getTime() - matchDate.getTime()) < 24 * 60 * 60 * 1000;

  const rounds = hands.reduce((acc: any, hand: any) => {
    if (!acc[hand.ROUND]) {
      acc[hand.ROUND] = [];
    }
    acc[hand.ROUND].push(hand);
    return acc;
  }, {});

  return (
    <div style={{ backgroundColor: "rgb(250, 250, 250)", padding: "20px" }}>
      <h1 style={{ color: "#943030", fontFamily: "HelveticaNeueLight, Helvetica, tahoma, arial", fontSize: "42px" }}>
        Korrigera resultat för {match.NAME}
      </h1>
      {isEditable ? (
        Object.entries(rounds).map(([round, hands]: [string, any]) => 
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
        <p style={{ color: "#943030", fontWeight: "bold" }}>Matchen är för gammal för att göra ändringar.</p>
      )}
      </div>
  );
}
