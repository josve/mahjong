import Link from "next/link";
import {
  getMatchById,
  getHandsByGameId,
  getTeamIdToNameNoAlias,
} from "@/lib/dbMatch";

export default async function MatchGridItem({ id }: { id: string }) {
  const match = await getMatchById(id);
  const hands = await getHandsByGameId(id);

  const name = match.NAME;
  const time = match.TIME;

  // generate a string with the time for the first and last rounds like (19:28-21:42)
  const firstRound = hands.length > 4 ? hands[4].TIME : hands[0].TIME;
  const lastRound = hands[hands.length - 1].TIME;

  // Find the number of rounds, this is the number of hands divided by 4
  const numberOfRounds = Math.floor(hands.length / 4 - 1);

  // Update time format
  const formatTime = (date: Date) =>
    date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  const timeString = `${formatTime(new Date(firstRound))}-${formatTime(
    new Date(lastRound)
  )}`;

  const teamIdToName = await getTeamIdToNameNoAlias();
  const getTeamName = (teamId: string) => teamIdToName[teamId];

  return (
    <div className="match-round-grid-item">
      <div className="match-round-time">
        {new Date(time).toLocaleDateString("sv-SE")} ({timeString})
      </div>
      <Link
        href={`/match/${id}`}
        className="match-round-name"
      >
        #{match.GAME_IDX}. {name}
      </Link>
      <p className="match-round-info">
        {numberOfRounds} omgångar, {getTeamName(match.TEAM_ID_1)},{" "}
        {getTeamName(match.TEAM_ID_2)}, {getTeamName(match.TEAM_ID_3)},{" "}
        {getTeamName(match.TEAM_ID_4)}
      </p>
    </div>
  );
}
