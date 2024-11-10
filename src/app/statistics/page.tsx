"use client"
import React, { useEffect, useState } from "react";
import PlayerScoreChart from "@/components/PlayerScoreChart";
import { Box } from "@mui/material";
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';

export default function StatisticsPage() {
  const [data, setData]: any = useState(null);
  const [period, setPeriod]: any = useState("all");

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch("/api/statistics");
      const result = await response.json();
      setData(result);
    };

    fetchData();
  }, []);

  const handlePeriodChange = (event: any) => {
    setPeriod(event.target.value);
  };

  if (!data) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <Box className="statistics-header" style={{  }}>
        <h1 style={{ justifySelf: "start" }}>Statistik</h1>
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
      <PlayerScoreChart
            matches={data.matches}
            teamIdToName={data.teamIdToName}
            allPlayers={data.allPlayers}
            teamIdToPlayerIds={data.teamIdToPlayerIds}
            playerColors={data.playerColors}
            period={period}
            />
    </div>
  );
}
