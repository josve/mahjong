import { getMatchById, getHandsByGameId, getTeamIdToName, getTeamColors } from "@/lib/dbMatch";
import MatchChart from "@/components/matchChart";

interface PageProps {
  params: {
    matchId: string;
  };
}

export default async function Page({ params }: PageProps) {
  const match = await getMatchById(params.matchId);
  const hands = await getHandsByGameId(params.matchId);
  const teamIdToName = await getTeamIdToName();
  const teamColors = await getTeamColors(); // Assuming you have a function to get team colors

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

  console.log(teamHands);

  const numRounds = Math.floor(hands.length / 4 - 1);

  return (
  <>
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
      <h1 style={{ margin: 0 }}>{match.NAME}</h1>
      <h2 style={{ margin: 0 }}>{numRounds} omgångar</h2>
    </div>
    <h3 style={{ color: "grey", fontSize: "smaller" }}>
      Datum {new Date(match.TIME).toLocaleDateString()}
    </h3>
    <div>
      <MatchChart
        hands={hands}
        teamHands={teamHands}
        teamIdToName={teamIdToName}
        teamColors={teamColors}
      />
    </div>
  </>
  );
}
