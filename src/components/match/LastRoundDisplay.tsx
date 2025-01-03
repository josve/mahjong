"use client";

import React from 'react';
import { Hand, IdToName } from '@/types/db';
import {
    Typography,
    Grid,
    Box,
    Chip,
    Tooltip,
} from '@mui/material';
import { CheckCircle, LocalFireDepartment } from '@mui/icons-material';
import { motion } from "motion/react";
import {Round} from "@/components/match/matchChartClient"; // Import motion
import CastleIcon from '@mui/icons-material/Castle';
import { orange } from '@mui/material/colors';

// Create motion-enhanced components
const MotionGrid = motion(Grid);
const MotionBox = motion(Box);

// Define animation variants
const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
            delayChildren: 0.2,
        },
    },
};

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
    hover: {
        scale: 1.05,
        transition: {
            duration: 0.3,
            ease: "easeInOut",
        },
    },
};

interface Props {
    readonly teamIdToName: IdToName;
    readonly round: Round;
}

const windIcon = (wind: string) => {
    const windMap: { [key: string]: string } = {
        E: 'Öst',
        N: 'Norr',
        W: 'Väst',
        S: 'Syd',
    };
    return windMap[wind] || wind;
};

export default function LastRoundDisplay({ teamIdToName, round }: Props) {
    const hands = round.hands;
    const maxHand = round.maxHand;
    const maxScore = round.maxScore;

    let highestScore = -100000;
    let highestScorePlayer = undefined;
    for (const hand of hands) {
        if (hand.HAND_SCORE > highestScore) {
            highestScore = hand.HAND_SCORE;
            highestScorePlayer = hand.TEAM_ID;
        }
    }

    return (
        <>
            <MotionGrid
                container
                spacing={2}
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                {hands.map((hand) => {

                    let oldHand: Hand | undefined = undefined;
                    if (round.previousHand) {
                        for (const prevHand of round.previousHand) {
                            if (prevHand.TEAM_ID === hand.TEAM_ID) {
                                oldHand = prevHand;
                            }
                        }
                    }

                    const hogmod = oldHand && oldHand.WIND == 'E' && hand.WIND == 'E';

                    const isWinner = hand.IS_WINNER;
                    const isHighroller = hand.HAND >= 100;

                    const isBestHand = !isHighroller && hand.HAND == maxHand;
                    const isBestScore = !isHighroller && !isBestHand && hand.HAND_SCORE == maxScore;

                    const hasHighestWin = highestScorePlayer == hand.TEAM_ID;
                    return (
                        <MotionGrid
                            item
                            xs={12}
                            sm={6}
                            md={3}
                            key={hand.TEAM_ID}
                            variants={itemVariants}
                            whileHover="hover"
                        >
                            <MotionBox
                                sx={{
                                    border: isWinner ? '2px solid #4caf50' : '1px solid #e0e0e0',
                                    borderRadius: 2,
                                    p: 2,
                                    height: '100%',
                                    position: 'relative',
                                    backgroundColor: isWinner ? '#e8f5e9' : 'transparent',
                                }}
                                initial={{ scale: 1 }}
                                animate={{ scale: 1 }}
                                whileHover={{ scale: 1.05 }}
                                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                            >
                                {/* Vinnareikon */}
                                {hasHighestWin ? (
                                    <Tooltip title="Högsta poäng">
                                        <CheckCircle
                                            color="success"
                                            sx={{ position: 'absolute', top: 8, right: 8 }}
                                        />
                                    </Tooltip>
                                ) : null}

                                {/* Lagets Namn */}
                                <Typography variant="h6" component="div" gutterBottom>
                                    {teamIdToName[hand.TEAM_ID]}
                                </Typography>

                                {/* Vind */}
                                <Typography variant="body2" color="text.secondary">
                                    {windIcon(hand.WIND)}
                                </Typography>

                                {/* Poäng */}
                                <Typography variant="body1" sx={{ mt: 1 }}>
                                    Poäng: {hand.HAND}
                                </Typography>

                                {/* Resultat */}
                                <Typography
                                    variant="body1"
                                    color={hand.HAND_SCORE >= 0 ? 'green' : 'error'}
                                    sx={{ mt: 1 }}
                                >
                                    Resultat: {hand.HAND_SCORE}
                                </Typography>

                                {isHighroller && (
                                    <Chip
                                        label={hand.HAND === 300 ? 'Limit hand' : 'Highroller'}
                                        color={hand.HAND === 300 ? 'error' : 'secondary'}
                                        size="small"
                                        icon={<LocalFireDepartment />}
                                        sx={{
                                            position: 'absolute',
                                            bottom: 8,
                                            right: 8,
                                        }}
                                    />
                                )}

                                {isBestHand && (
                                    <Chip
                                        label="Bästa hand"
                                        color="primary"
                                        size="small"
                                        icon={<LocalFireDepartment />}
                                        sx={{
                                            position: 'absolute',
                                            bottom: 8,
                                            right: 8,
                                        }}
                                    />
                                )}

                                {isBestScore && (
                                    <Chip
                                        label="Störst vinst"
                                        color="primary"
                                        size="small"
                                        icon={<LocalFireDepartment />}
                                        sx={{
                                            position: 'absolute',
                                            bottom: 8,
                                            right: 8,
                                        }}
                                    />
                                )}

                                {hogmod && (
                                    <Chip
                                        label="Högmod"
                                        color="warning"
                                        size="small"
                                        icon={<CastleIcon />}
                                        sx={{
                                            position: 'absolute',
                                            bottom: 8,
                                            right: 8,
                                        }}
                                    />
                                )}
                            </MotionBox>
                        </MotionGrid>
                    );
                })}
            </MotionGrid>
        </>
    );
}