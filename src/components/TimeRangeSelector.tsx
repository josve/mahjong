"use client";

import React from "react";
import { Select, MenuItem, FormControl, InputLabel } from "@mui/material";

interface TimeRangeSelectorProps {
  timeRange: string;
  setTimeRange: (value: string) => void;
}

const TimeRangeSelector: React.FC<TimeRangeSelectorProps> = ({ timeRange, setTimeRange }) => {
  return (
    <FormControl variant="outlined" style={{ marginBottom: "20px", minWidth: 120 }}>
      <InputLabel id="time-range-label">Tidsintervall</InputLabel>
      <Select
        labelId="time-range-label"
        value={timeRange}
        onChange={(e) => setTimeRange(e.target.value)}
        label="Tidsintervall"
      >
        <MenuItem value="ny tid">Ny tid</MenuItem>
        <MenuItem value="all tid">All tid</MenuItem>
        <MenuItem value="nuvarande år">Nuvarande år</MenuItem>
      </Select>
    </FormControl>
  );
};

export default TimeRangeSelector;
