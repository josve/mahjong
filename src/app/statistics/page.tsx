import React, { useEffect, useState } from "react";
import PlayerScoreChart from "@/components/PlayerScoreChart";
import { Select, MenuItem, FormControl, InputLabel } from "@mui/material";

export default function StatisticsPage() {
  const [data, setData] = useState(null);
  const [period, setPeriod] = useState("all");

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch("/api/statistics");
      const result = await response.json();
      setData(result);
    };

    fetchData();
  }, []);

  const handlePeriodChange = (event) => {
    setPeriod(event.target.value);
  };

  if (!data) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Statistik</h1>
      <FormControl>
        <InputLabel id="period-select-label">Period</InputLabel>
        <Select
          labelId="period-select-label"
          value={period}
          onChange={handlePeriodChange}
        >
          <MenuItem value="all">All time</MenuItem>
          <MenuItem value="new">New period</MenuItem>
          <MenuItem value="year">Current year</MenuItem>
        </Select>
      </FormControl>
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
