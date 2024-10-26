import {
  getMatchById,
  getHandsByGameId,
  getTeamIdToName,
  getTeamColors,
} from "@/lib/dbMatch";
import MatchChart from "@/components/match/matchChart";
import RegisterResultControls from "@/components/match/RegisterResultControls";
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

  return (
    <div>
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
      {match.COMMENT && (
        <div
          style={{
            paddingBottom: "10px",
            paddingTop: "10px",
          }}
        >
          {<p>Kommentar: {match.COMMENT}</p>}
        </div>
      )}
      <MatchChart
        hands={hands}
        teamHands={teamHands}
        teamIdToName={teamIdToName}
        teamColors={teamColors}
      />
      <RegisterResultControls matchId={params.matchId} />
    </div>
  );
}
