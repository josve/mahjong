"use client";

import React, { useState, useEffect } from "react";
import { Select, MenuItem, FormControl, InputLabel } from "@mui/material";
import Connection from "@/lib/connection";

export default function StatisticsPage() {
  const [timeRange, setTimeRange] = useState("ny tid");
  const [matches, setMatches] = useState([]);

  useEffect(() => {
    async function fetchMatches() {
      const connection = await Connection.getInstance().getConnection();
      try {
        let query = "SELECT * FROM Games";
        if (timeRange === "ny tid") {
          query += " WHERE TIME >= '2024-10-01'";
        } else if (timeRange === "nuvarande år") {
          const currentYear = new Date().getFullYear();
          query += ` WHERE YEAR(TIME) = ${currentYear}`;
        }
        const [result] = await connection.query(query);
        setMatches(result);
      } finally {
        connection.release();
      }
    }
    fetchMatches();
  }, [timeRange]);

  return (
    <div style={{ padding: "20px" }}>
      <h1 style={{ color: "#943030", fontFamily: "HelveticaNeueLight, Helvetica, tahoma, arial", fontSize: "42px" }}>
        Statistik
      </h1>
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
      <div>
        {matches.length > 0 ? (
          matches.map((match) => (
            <div key={match.GAME_ID}>
              <p>{match.NAME} - {new Date(match.TIME).toLocaleDateString()}</p>
            </div>
          ))
        ) : (
          <p>Inga matcher hittades för det valda tidsintervallet.</p>
        )}
      </div>
    </div>
  );
}
