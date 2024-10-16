import {
  getMatchById,
  getHandsByGameId,
  getTeamIdToName,
  getTeamColors,
} from "@/lib/dbMatch";
import RoundResultFormAdd from "@/components/RoundResultFormAdd";
import MatchChart from "@/components/matchChart";
import { Metadata } from "next";

interface PageProps {
  params: {
    matchId: string;
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
  const hands = await getHandsByGameId(params.matchId);
  const teamIdToName = await getTeamIdToName();
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
  const teamColors = await getTeamColors();

  // Get the hands for each team
  const teamHands = hands.reduce((acc: any, hand: any) => {
    acc[hand.TEAM_ID] = acc[hand.TEAM_ID] || [];
    acc[hand.TEAM_ID].push(hand);
    return acc;
  }, {});

  // For each team, sum the HAND_SCORE for each round and add to the hands objects
  for (const teamId in teamHands) {
    const teamHand = teamHands[teamId];
    let totalScore = 0;
    for (let i = 0; i < teamHand.length; i++) {
      totalScore += teamHand[i].HAND_SCORE;
      teamHand[i].SCORE = totalScore;
    }
  }

  const numRounds = Math.floor(hands.length / 4 - 1);
  const matchDate = new Date(match.TIME);
  const isEditable =
    new Date().getTime() - matchDate.getTime() < 24 * 60 * 60 * 1000;

  return (
    <div style={{ backgroundColor: "rgb(250, 250, 250)" }}>
      <div
        style={{
          backgroundColor: "white",
          padding: "20px",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
        }}
      >
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
        <div>
          <MatchChart
            hands={hands}
            teamHands={teamHands}
            teamIdToName={teamIdToName}
            teamColors={teamColors}
          />
        </div>
        {isEditable ? (
          <>
            <RoundResultFormAdd
              teamIdToName={relevantTeams}
              matchId={params.matchId}
            />
            <div style={{ marginTop: "20px" }}>
              <a
                href={`/match/${params.matchId}/edit`}
                className="correct-result-link"
              >
                Korrigera resultat
              </a>
            </div>
          </>
        ) : (
          <p className="too-old-text">
            Matchen är för gammal för att göra ändringar.
          </p>
        )}
      </div>
    </div>
  );
}
