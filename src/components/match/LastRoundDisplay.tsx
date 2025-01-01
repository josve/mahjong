// components/LastRoundDisplay.tsx

import React from 'react';
import { Hand, IdToName } from '@/types/db';
import {
    Card,
    CardContent,
    Typography,
    Grid,
    Box,
    Chip,
    Tooltip,
} from '@mui/material';
import { CheckCircle } from '@mui/icons-material';

interface Props {
    readonly teamIdToName: IdToName;
    readonly hands: Hand[];
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

export default function LastRoundDisplay({ teamIdToName, hands }: Props) {
    return (
                <Grid container spacing={2}>
                    {hands.map((hand) => {
                        const isWinner = hand.IS_WINNER;
                        return (
                            <Grid item xs={12} sm={6} md={3} key={hand.TEAM_ID}>
                                <Box
                                    sx={{
                                        border: isWinner ? '2px solid #4caf50' : '1px solid #e0e0e0',
                                        borderRadius: 2,
                                        p: 2,
                                        height: '100%',
                                        position: 'relative',
                                        backgroundColor: isWinner ? '#e8f5e9' : 'transparent',
                                    }}
                                >
                                    <Typography variant="h6" component="div" gutterBottom>
                                        {teamIdToName[hand.TEAM_ID]}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        {windIcon(hand.WIND)}
                                    </Typography>
                                    <Typography variant="body1" sx={{ mt: 1 }}>
                                        Poäng: {hand.HAND}
                                    </Typography>
                                    <Typography
                                        variant="body1"
                                        color={hand.HAND_SCORE >= 0 ? 'green' : 'error'}
                                        sx={{ mt: 1 }}
                                    >
                                        Resultat: {hand.HAND_SCORE}
                                    </Typography>
                                </Box>
                            </Grid>
                        );
                    })}
                </Grid>
    );
}