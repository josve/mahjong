import ReactEcharts from "echarts-for-react";
import React, { useState } from "react";
import { registerTransform } from "echarts/core";
import { aggregate } from "echarts-simple-transform";

interface BoxPlotProps {
    readonly allHands: { [key: string]: number[] };
    readonly allHandsNoTeams: { [key: string]: number[] };
    readonly allScores: { [key: string]: number[] };
    readonly allScoresNoTeams: { [key: string]: number[] };
    readonly getPlayerColor: (playerName: string) => string | undefined;
}

const BoxPlot: React.FC<BoxPlotProps> = ({
                                             allHands,
                                             allHandsNoTeams,
                                             allScores,
                                             allScoresNoTeams,
                                             getPlayerColor,
                                         }) => {

    const [selectedSeries, setSelectedSeries] = useState('allHands');

    const handleSeriesChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedSeries(event.target.value);
    };

    const seriesToUse = selectedSeries === 'allHands' ? allHands :
                        selectedSeries === 'allHandsNoTeams' ? allHandsNoTeams :
                        selectedSeries === 'allScores' ? allScores :
                        allScoresNoTeams;

    const playerNames = Object.keys(seriesToUse);
    registerTransform(aggregate);

    const sourceData = [];
    sourceData.push(["Player","Score"]);
    const colors: any[] = [];
    playerNames.forEach((playerName) => {
        colors.push(getPlayerColor(playerName));
        for (const hand of seriesToUse[playerName]) {
            sourceData.push([playerName, hand]);
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
        <div>
            <select value={selectedSeries} onChange={handleSeriesChange}>
                <option value="allHands">Händer (med lag)</option>
                <option value="allHandsNoTeams">Händer (utan lag)</option>
                <option value="allScores">Poäng (med lag)</option>
                <option value="allScoresNoTeams">Poäng (utan lag)</option>
            </select>
            <ReactEcharts
                option={option}
                style={{ height: "400px" }}
            />
        </div>
    );

};

export default BoxPlot;
