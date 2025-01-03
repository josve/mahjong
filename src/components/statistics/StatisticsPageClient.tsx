"use client"
import React, { useState } from "react";
import PlayerScoreChart from "@/components/statistics/PlayerScoreChart";
import {Box, FormControlLabel, FormGroup, Switch} from "@mui/material";
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import { CircularProgress } from "@mui/material";
import {StatisticsResponse} from "@/types/api";

interface Props {
    readonly data: StatisticsResponse;
}

export default function StatisticsPageClient({ data }: Props) {

    const [period, setPeriod] = useState<"all" | "new" | "year">("all");
    const [includeTeams, setIncludeTeams] = useState<boolean>(false);

    const handlePeriodChange = (event: any) => {
        setPeriod(event.target.value);
    };

    if (!data) {
        return <Box
            sx={{
                display: 'fixed',
                top: "0",
                left: "0",
                margin: "0",
                padding: "0",
                justifyContent: 'center',
                alignItems: 'center',
                height: 'calc(100vh - 150px)',
                width: 'calc(100vw - 50px)',
            }}
        ><CircularProgress/>
        </Box>;
    }

    return (
        <div>
            <Box className="statistics-header" style={{}}>
                <h1 style={{justifySelf: "start"}}>Statistik</h1>
                <ToggleButtonGroup
                    value={period}
                    exclusive
                    className="statistics-buttons"
                    onChange={handlePeriodChange}
                    aria-label="Tid"
                >
                    <ToggleButton value="all" aria-label="left aligned">
                        All tid
                    </ToggleButton>
                    <ToggleButton value="new" aria-label="centered">
                        Ny tid
                    </ToggleButton>
                    <ToggleButton value="year" aria-label="right aligned">
                        Nuvarande år
                    </ToggleButton>
                </ToggleButtonGroup>
            </Box>
            <FormGroup>
                <FormControlLabel
                    control={<Switch checked={includeTeams} onChange={() => {setIncludeTeams(!includeTeams);}}/>}
                    label="Visa lag"/>
            </FormGroup>
            <PlayerScoreChart
                matches={data.matches}
                teamIdToName={data.teamIdToName}
                teamIdToPlayerIds={data.teamIdToPlayerIds}
                allTeamsAndPlayers={data.allTeamsAndPlayers}
                teamAndPlayerColors={data.teamAndPlayerColors}
                includeTeams={includeTeams}
                period={period}
            />
        </div>
    );
}
