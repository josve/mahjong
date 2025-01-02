"use client"
import Link from "next/link";
import {
    formatDate,
    capitalize
} from "@/lib/formatting";
import {Box} from "@mui/material";
import {Hand, MatchWithIdx} from "@/types/db";
import { motion } from "motion/react"; // Import motion

const MotionDiv = motion.div;
const MotionBox = motion(Box);

interface Props {
    readonly match: MatchWithIdx;
    readonly hands: Hand[];
    readonly id: string;
}

export default function MatchGridItemClient({ match, hands, id }: Props) {

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
            {/* Animated Match Grid Item */}
            <MotionDiv
                className="match-grid-item"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
            >
                <div className="match-grid-item-number">
                    #{match.GAME_IDX}
                </div>
                <div className="match-grid-item-content">
                    <div className="match-grid-item-rounds">
                        {numberOfRounds} omgångar
                    </div>
                    <MotionBox
                        className="match-grid-item-time label"
                        sx={{ display: { xs: "none", sm: "block" } }}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2, duration: 0.5 }}
                    >
                        {capitalize(formatDate(time))} ({timeString})
                    </MotionBox>
                    <MotionBox
                        className="match-grid-item-time label"
                        sx={{ display: { xs: "block", sm: "none" } }}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2, duration: 0.5 }}
                    >
                        {capitalize(formatDate(time))}
                    </MotionBox>

                    <div className="match-list-item-name">
                        {name}
                    </div>
                    <p className="match-round-info label">
                        {match.COMMENT}
                    </p>
                </div>
            </MotionDiv>
        </Link>
    );
}
