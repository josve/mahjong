import ReactEcharts from "echarts-for-react";
import React, { useState } from "react";
import { registerTransform } from "echarts/core";

// @ts-ignore
import { aggregate } from "echarts-simple-transform";

import { FormControl, InputLabel, Select, MenuItem} from "@mui/material";
import {IdToNumbers, PlayerNameToColor} from "@/types/components";
import {MahjongStats} from "@/lib/statistics";

interface BoxPlotProps {
    readonly stats: MahjongStats
}

const BoxPlot: React.FC<BoxPlotProps> = ({
                                             stats
                                         }) => {

    const [selectedSeries, setSelectedSeries] = useState('allHands');

    const handleSeriesChange = (event: any) => {
        setSelectedSeries(event.target.value);
    };

    registerTransform(aggregate);

    const sourceData = [];
    sourceData.push(["Player","Score"]);

    const playerData = stats.getNonTeamStats();
    const colors: any[] = [];

    playerData.forEach((data) => {
        const seriesToUse = selectedSeries === 'allHands' ? data.allHands :
            selectedSeries === 'allHandsNoTeams' ? data.allHandsNoTeams :
                selectedSeries === 'allScores' ? data.allScores :
                    data.allScoresNoTeams;

        colors.push(data.color);
        for (const hand of seriesToUse) {
            sourceData.push([data.name, hand]);
        }
    });

    const option = {
        color: colors,
        dataset: [
            {
                id: 'raw',
                source: sourceData,
            },
            {
                id: 'agg_score',
                fromDatasetId: 'raw',
                transform: [
                    {
                        type: 'ecSimpleTransform:aggregate',
                        config: {
                            resultDimensions: [
                                { name: 'min', from: 'Score', method: 'min' },
                                { name: 'Q1', from: 'Score', method: 'Q1' },
                                { name: 'median', from: 'Score', method: 'median' },
                                { name: 'Q3', from: 'Score', method: 'Q3' },
                                { name: 'max', from: 'Score', method: 'max' },
                                { name: 'Player', from: 'Player' }
                            ],
                            groupBy: 'Player'
                        }
                    },
                ]
            }
        ],
        tooltip: {
            trigger: 'axis',
            confine: true
        },
        grid: {
            left: '10%',
            right: '10%',
            bottom: '15%',
        },
        xAxis: {
            name: 'Poäng',
            nameLocation: 'middle',
            nameGap: 30,
            scale: true
        },
        yAxis: {
            type: 'category'
        },
        series: [
            {
                name: 'boxplot',
                type: 'boxplot',
                datasetId: 'agg_score',
                colorBy: 'data',
                itemStyle: {
                    color: "white",
                },
                encode: {
                    x: ['min', 'Q1', 'median', 'Q3', 'max'],
                    y: 'Player',
                    itemName: ['Player'],
                    tooltip: ['min', 'Q1', 'median', 'Q3', 'max']
                }
            },
        ]
    };

    return (
        <div style={{ paddingTop: "20px"}}>
            <div style={{ paddingLeft: "20px"}}>
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
            <ReactEcharts
                option={option}
                style={{ height: "400px" }}
            />
        </div>
    );

};

export default BoxPlot;
