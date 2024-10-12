import { getMatchById, getHandsByGameId, getTeamIdToName, getTeamColors } from "@/lib/dbMatch";
import RoundResultForm from "@/components/RoundResultForm";
import MatchChart from "@/components/matchChart";

interface PageProps {
  params: {
    matchId: string;
  };
}

export default async function Page({ params }: PageProps) {
  const match = await getMatchById(params.matchId);
  const hands = await getHandsByGameId(params.matchId);
  const teamIdToName = (await getTeamIdToName()) || {};
  const relevantTeamIds = [
    match.TEAM_ID_1,
    match.TEAM_ID_2,
    match.TEAM_ID_3,
    match.TEAM_ID_4,
  ];
  const relevantTeams = Object.fromEntries(
    Object.entries(teamIdToName).filter(([teamId]) =>
      relevantTeamIds.includes(teamId)
    )
  );
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
  <div style={{ backgroundColor: "rgb(250, 250, 250)" }}>
    <div style={{ backgroundColor: "white", padding: "20px", boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)" }}>
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
      <h1 style={{ margin: 0, color: "#943030", fontFamily: "HelveticaNeueLight, Helvetica, tahoma, arial", fontSize: "42px" }}>
        {match.NAME}
      </h1>
      <h2 style={{ margin: 0, textAlign: "left" }}>{numRounds} omgångar</h2>
    </div>
    <h3 style={{ color: "#909090", fontSize: "16px", textAlign: "left", fontFamily: "HelveticaNeueLight, Helvetica, tahoma, arial" }}>
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
    <RoundResultForm teamIdToName={relevantTeams} matchId={params.matchId} />
    <div style={{ marginTop: "20px" }}>
      <a href={`/match/${params.matchId}/edit`} style={{ color: "#943030", textDecoration: "none", fontWeight: "bold" }}>
        Korrigera resultat
      </a>
    </div>
    </div>
  </div>
  );
}
