import React from "react";
import ReactEcharts from "echarts-for-react";
import { registerTransform } from "echarts/core";
import { aggregate } from "echarts-simple-transform";
import { FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import { MahjongStats } from "@/lib/statistics";

interface HistogramProps {
  readonly stats: MahjongStats;
}

const Histogram: React.FC<HistogramProps> = ({ stats }) => {
  const [selectedSeries, setSelectedSeries] = React.useState("allHands");

  const handleSeriesChange = (event: any) => {
    setSelectedSeries(event.target.value);
  };

  registerTransform(aggregate);

  const sourceData = [];
  sourceData.push(["Player", "Score"]);

  const playerData = stats.getNonTeamStats();
  const colors: any[] = [];

  playerData.forEach((data) => {
    const seriesToUse =
      selectedSeries === "allHands"
        ? data.allHands
        : selectedSeries === "allHandsNoTeams"
        ? data.allHandsNoTeams
        : selectedSeries === "allScores"
        ? data.allScores
        : data.allScoresNoTeams;

    colors.push(data.color);
    for (const hand of seriesToUse) {
      sourceData.push([data.name, hand]);
    }
  });

  const option = {
    color: colors,
    dataset: [
      {
        id: "raw",
        source: sourceData,
      },
      {
        id: "agg_score",
        fromDatasetId: "raw",
        transform: [
          {
            type: "ecSimpleTransform:aggregate",
            config: {
              resultDimensions: [
                { name: "min", from: "Score", method: "min" },
                { name: "Q1", from: "Score", method: "Q1" },
                { name: "median", from: "Score", method: "median" },
                { name: "Q3", from: "Score", method: "Q3" },
                { name: "max", from: "Score", method: "max" },
                { name: "Player", from: "Player" },
              ],
              groupBy: "Player",
            },
          },
        ],
      },
    ],
    tooltip: {
      trigger: "axis",
      confine: true,
    },
    grid: {
      left: "10%",
      right: "10%",
      bottom: "15%",
    },
    xAxis: {
      name: "Poäng",
      nameLocation: "middle",
      nameGap: 30,
      scale: true,
    },
    yAxis: {
      type: "category",
    },
    series: [
      {
        name: "histogram",
        type: "bar",
        datasetId: "raw",
        encode: {
          x: "Score",
          y: "Player",
          itemName: ["Player"],
          tooltip: ["Score"],
        },
        barWidth: "50%",
        itemStyle: {
          color: (params: any) => colors[params.dataIndex % colors.length],
        },
      },
    ],
  };

  return (
    <div style={{ paddingTop: "20px" }}>
      <div style={{ paddingLeft: "20px" }}>
        <FormControl>
          <InputLabel id="data-label">Data</InputLabel>
          <Select
            labelId="data-label"
            id="data-select"
            label="Data"
            value={selectedSeries}
            onChange={handleSeriesChange}
          >
            <MenuItem value="allHands">Händer (med lag)</MenuItem>
            <MenuItem value="allHandsNoTeams">Händer (utan lag)</MenuItem>
            <MenuItem value="allScores">Poäng (med lag)</MenuItem>
            <MenuItem value="allScoresNoTeams">Poäng (utan lag)</MenuItem>
          </Select>
        </FormControl>
      </div>
      <ReactEcharts option={option} style={{ height: "400px" }} />
    </div>
  );
};

export default Histogram;
