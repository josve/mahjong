import Link from "next/link";
import {
  getMatchById,
  getHandsByGameId,
} from "@/lib/dbMatch";
import { 
formatDate, 
capitalize 
} from "@/lib/formatting";
import {Box} from "@mui/material";

interface Props {
    readonly id: string;
}

export default async function MatchGridItem({ id }: Props) {
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
        date.toLocaleTimeString("sv-SE", {hour: "2-digit", minute: "2-digit"});
    const timeString = `${formatTime(new Date(firstRound))}-${formatTime(
        new Date(lastRound)
    )}`;

  return (
  <Link href={`/match/${id}`}>
    <div className="match-grid-item">
     <div className="match-grid-item-number">
        #{match.GAME_IDX}
      </div>
        <div className="match-grid-item-content">
            <div className="match-grid-item-rounds">
                {numberOfRounds} omgångar
            </div>
            <Box className="match-grid-item-time label" sx={{ display: { xs: "none", sm: "block" } }}>
                {capitalize(formatDate(time))} ({timeString})
            </Box>
            <Box className="match-grid-item-time label" sx={{ display: { xs: "block", sm: "none" } }}>
                {capitalize(formatDate(time))}
            </Box>

            <div className="match-list-item-name">
                {name}
            </div>
            <p className="match-round-info label">
                {match.COMMENT}
            </p>
        </div>
    </div>
  </Link>
  );
}
