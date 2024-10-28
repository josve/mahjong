"use client"
import React, { useState, useEffect } from "react";
import { Box, Typography, Slider, Select, MenuItem, Checkbox, FormControlLabel, FormControl, InputLabel } from "@mui/material";

export default function ScoreCalculatorPage() {
    const [flowers, setFlowers] = useState(0);

    const [combos, setCombos] = useState([
        { name: "(Inget)", isHidden: false },
        { name: "(Inget)", isHidden: false },
        { name: "(Inget)", isHidden: false },
        { name: "(Inget)", isHidden: false },
        { name: "(Inget par)", isHidden: false },
    ]);

    const [isSelfTouch, setIsSelfTouch] = useState(false);
    const [isFullStege, setIsFullStege] = useState(false);
    const [isEnSort, setIsEnSort] = useState(false);
    const [isEnSortEnbart, setIsEnSortEnbart] = useState(false);

    const [flowerScore, setFlowerScore] = useState(0);
    const [comboScore, setComboScore] = useState([
        0, 0, 0, 0, 0
    ]);
    const [mahjongScore, setMahjongScore] = useState(0);
    const [selfTouchScore, setSelfTouchScore] = useState(0);
    const [isMahjong, setIsMahjong] = useState(false);
    const [noScorePoints, setNoScorePoints] = useState(0);
    const [almostSelfTouchPoints, setAlmostSelfTouchPoints] = useState(0);

    const [noStegarMultipler, setNoStegarMultipler] = useState(0);
    const [fullStegeMultipler, setFullStegeMultipler] = useState(0);
    const [totalMultiplier, setTotalMultiplier] = useState(0);
    const [oneKindMultipler, setOneKindMultipler] = useState(0);
    const [oneKindAndDragonsMultipler, setOneKindAndDragonsMultipler] = useState(0);
    const [allHiddenMultipler, setAllHiddenMultipler] = useState(0);
    const [dragonsMultipler, setDragonsMultipler] = useState(0);
    const [windMultiplier, setWindMultiplier] = useState(0);
    const [threeHiddenMultipler, setThreeHiddenMultipler] = useState(0);
    const [totalScore, setTotalScore] = useState(0);

    useEffect(() => {
        let score = 0;
        score += flowerScore;
        comboScore.map((combo) => score += combo);
        score += mahjongScore;
        score += selfTouchScore;
        score += noScorePoints;
        score *= totalMultiplier;
        setTotalScore(score);
    }, [totalMultiplier, comboScore, flowerScore, mahjongScore, selfTouchScore, noScorePoints]);

    useEffect(() => {
        let scoreMultiplier = 1;
        if (combos.filter((combo) => combo.isHidden && (combo.name.includes("Tretal") || combo.name.includes("Fyrtal"))).length > 2) {
            scoreMultiplier *= 2;
        }

        setThreeHiddenMultipler(scoreMultiplier);
    }, [combos]);

    useEffect(() => {
        let scoreMultiplier = 1;

        combos.filter((combo) =>
            combo.name.includes("Tretal egen vind") ||
            combo.name.includes("Fyrtal egen vind"))
            .forEach(combo => scoreMultiplier *= 2);

        setWindMultiplier(scoreMultiplier);
    }, [combos]);

    useEffect(() => {
        let scoreMultiplier = 1;

        combos.filter((combo) =>
            combo.name.includes("Tretal drakar") ||
            combo.name.includes("Fyrtal drakar"))
            .forEach(combo => scoreMultiplier *= 2);

        setDragonsMultipler(scoreMultiplier);
    }, [combos]);

    useEffect(() => {
        setTotalMultiplier(noStegarMultipler * fullStegeMultipler * oneKindAndDragonsMultipler * oneKindMultipler * dragonsMultipler * windMultiplier * threeHiddenMultipler);
    }, [noStegarMultipler, fullStegeMultipler, oneKindAndDragonsMultipler, oneKindMultipler, allHiddenMultipler, dragonsMultipler, windMultiplier, threeHiddenMultipler]);

    useEffect(() => {
        setAllHiddenMultipler(isMahjong &&
        combos.every((combo) => combo.isHidden) ? 2 : 1);
    }, [isMahjong, combos]);

    useEffect(() => {
        setOneKindAndDragonsMultipler(isMahjong &&
        isEnSort ? 2 : 1);
    }, [isMahjong, isEnSort]);

    useEffect(() => {
        setOneKindMultipler(isMahjong &&
        isEnSortEnbart ? 8 : 1);
    }, [isMahjong, isEnSortEnbart]);

    useEffect(() => {
        setFullStegeMultipler(isMahjong &&
            isFullStege &&
        combos.filter((combo) => combo.name.includes("Stege")).length > 2
            ? 2 : 1);
    }, [combos,isMahjong, isFullStege]);

    useEffect(() => {
        setNoStegarMultipler(isMahjong &&
        combos.filter((combo) => combo.name.includes("Stege")).length === 0
            ? 2 : 1);
    }, [combos,isMahjong]);

    useEffect(() => {
        setAlmostSelfTouchPoints(
            combos.slice(0, 4).every((combo) => combo.isHidden) && !isSelfTouch ? 2 : 0
        );
    }, [isSelfTouch, combos]);

    useEffect(() => {
        setNoScorePoints(isMahjong && comboScore.every((value => value == 0)) ? 10 : 0)
    }, [isMahjong, comboScore]);

    useEffect(() => {
        setMahjongScore(isMahjong ? 10 : 0);
    }, [isMahjong]);

    useEffect(() => {
        setSelfTouchScore(isMahjong && isSelfTouch ? 2 : 0);
    }, [isSelfTouch, isMahjong]);

    useEffect(() => {
        setIsMahjong(combos.every((combo) => combo.name !== "(Inget)" && combo.name !== "(Inget par)"));
    }, [combos]);

    useEffect(() => {
        const scoreForCombo = (comboName: string, isHidden: boolean) => {
            let comboScore = 0;
            if (comboName.includes("Tretal låg")) {
                comboScore = 2;
            } else if (comboName.includes("Tretal hög") ||
                comboName.includes("Tretal annan vind") ||
                comboName.includes("Tretal egen vind") ||
                comboName.includes("Tretal drakar")) {
                comboScore = 4;
            } else if (comboName.includes("Fyrtal låg")) {
                comboScore = 8;
            } else if (comboName.includes("Fyrtal hög") ||
                comboName.includes("Fyrtal annan vind") ||
                comboName.includes("Fyrtal egen vind") ||
                comboName.includes("Fyrtal drakar")) {
                comboScore = 16;
            }

            if (isHidden) {
                // Should not affect pairs
                comboScore *= 2;
            }
            if (comboName.includes("Par drakar") ||
                comboName.includes("Par egen vind")) {
                comboScore = 2;
            }

            return comboScore;
        };

        setComboScore(combos.map((combo) => {
            return scoreForCombo(combo.name, combo.isHidden);
        }));
    }, [combos])

    useEffect(() => {
        setFlowerScore(flowers * 4);
    }, [flowers]);

    const handleFlowerChange = (event: any, newValue: any) => {
        setFlowers(newValue);
    };

    const handleComboChange = (index: any, event: any) => {
        const newCombos = [...combos];
        newCombos[index].name = event.target.value;
        setCombos(newCombos);
    };

    const handleHiddenChange = (index: any, event: any) => {
        const newCombos = [...combos];
        newCombos[index].isHidden = event.target.checked;
        setCombos(newCombos);
    };

    const calculateScore = () => {
        let totalScore = 0;
        totalScore += flowerScore;
        comboScore.map((combo) => totalScore += combo);
        totalScore += mahjongScore;
        totalScore += selfTouchScore;
        totalScore += noScorePoints;
        totalScore *= totalMultiplier;
        return totalScore;
    };

    return (
        <Box >
            <Typography variant="h4" gutterBottom>Poängräknare</Typography>
            <Box sx={{ marginBottom: "25px" }}>
                <Typography variant="h6">Hand</Typography>
                <Box sx={{ display: "flex", alignItems: "center", marginBottom: "8px", background: "#F6F6F6", padding: "10px" }}>
                    <Slider value={flowers} onChange={handleFlowerChange} min={0} max={8} sx={{ width: "250px", marginRight: "15px" }} />
                    <Typography>{flowers} blommor</Typography>
                    {flowerScore > 0 &&
                        <span style={{ textAlign: "right" }}>
                            {flowerScore + 'p'}
                        </span>}
                </Box>
                {combos.map((combo, index) => (
                    <Box key={index} sx={{ display: "flex", alignItems: "center", marginBottom: "8px", background: "#F6F6F6", padding: "10px" }}>
                        <FormControl sx={{ width: "280px", marginRight: "15px" }}>
                            <InputLabel>Kombination {index + 1}</InputLabel>
                            {index < 4 ?
                                <Select value={combo.name} onChange={(event) => handleComboChange(index, event)}>
                                    <MenuItem value="(Inget)">(Inget)</MenuItem>
                                    <MenuItem disabled>------</MenuItem>
                                    <MenuItem value="Stege">Stege</MenuItem>
                                    <MenuItem disabled>------</MenuItem>
                                    <MenuItem value="Tretal låg (2-8)">Tretal låg (2-8)</MenuItem>
                                    <MenuItem value="Tretal hög (1,9)">Tretal hög (1,9)</MenuItem>
                                    <MenuItem value="Tretal annan vind">Tretal annan vind</MenuItem>
                                    <MenuItem value="Tretal egen vind">Tretal egen vind</MenuItem>
                                    <MenuItem value="Tretal drakar">Tretal drakar</MenuItem>
                                    <MenuItem disabled>------</MenuItem>
                                    <MenuItem value="Fyrtal låg (2-8)">Fyrtal låg (2-8)</MenuItem>
                                    <MenuItem value="Fyrtal hög (1,9)">Fyrtal hög (1,9)</MenuItem>
                                    <MenuItem value="Fyrtal annan vind">Fyrtal annan vind</MenuItem>
                                    <MenuItem value="Fyrtal egen vind">Fyrtal egen vind</MenuItem>
                                    <MenuItem value="Fyrtal drakar">Fyrtal drakar</MenuItem>
                                </Select> :
                                <Select value={combo.name} onChange={(event) => handleComboChange(index, event)}>
                                    <MenuItem value="(Inget)">(Inget)</MenuItem>
                                    <MenuItem disabled>------</MenuItem>
                                    <MenuItem value="(Inget par)">(Inget par)</MenuItem>
                                    <MenuItem value="Annat par">Annat par</MenuItem>
                                    <MenuItem value="Par drakar">Par drakar</MenuItem>
                                    <MenuItem value="Par egen vind">Par egen vind</MenuItem>
                                </Select>}

                        </FormControl>
                        <FormControlLabel control={<Checkbox checked={combo.isHidden} onChange={(event) => handleHiddenChange(index, event)} />} label="Dold" />
                        {comboScore[index] > 0 &&
                        <span>
                            {comboScore[index] + 'p'}
                        </span>}
                    </Box>
                ))}
            </Box>
            {isMahjong &&
                <>
                    <Box sx={{ marginBottom: "25px" }}>
                        <Typography variant="h6">Mahjong</Typography>
                        <div className="score">{mahjongScore + 'p'}</div>
                    </Box>
                    { selfTouchScore > 0 &&
                    <Box sx={{ marginBottom: "25px" }}>
                        <Typography variant="h6">Self touch</Typography>
                        <div className="score">{selfTouchScore + 'p'}</div>
                    </Box>}
                    {noScorePoints > 0 &&
                        <Box sx={{ marginBottom: "25px" }}>
                            <Typography variant="h6">Ingen poäng mahjong</Typography>
                            <div className="score">{noScorePoints + 'p'}</div>
                        </Box>
                    }
                    {almostSelfTouchPoints > 0 &&
                        <Box sx={{ marginBottom: "25px" }}>
                            <Typography variant="h6">Nästan self touch</Typography>
                            <div className="score">{almostSelfTouchPoints + 'p'}</div>
                        </Box>
                    }
                    <Box sx={{ marginBottom: "25px" }}>
                        <FormControlLabel control={<Checkbox checked={isSelfTouch} onChange={(event) => setIsSelfTouch(event.target.checked)} />} label="Mahjong på dragen bricka (self touch)" />
                    </Box>
                </>}
            <Box sx={{ marginBottom: "25px" }}>
                <Typography variant="h6">Multiplikatorer</Typography>
            </Box>
            {isMahjong && <>
                <Box sx={{ marginBottom: "25px" }}>
                    <FormControlLabel control={<Checkbox checked={isFullStege} onChange={(event) => setIsFullStege(event.target.checked)} />} label="Stege 1-9 av en sort" />
                    <FormControlLabel control={<Checkbox checked={isEnSort} onChange={(event) => setIsEnSort(event.target.checked)} />} label="En sort + vindar/drakar" />
                    <FormControlLabel control={<Checkbox checked={isEnSortEnbart} onChange={(event) => setIsEnSortEnbart(event.target.checked)} />} label="En sort enbart" />
                </Box>
                {noStegarMultipler > 1 &&
                    <Box sx={{ marginBottom: "25px" }}>
                        <Typography variant="h6">Inga stegar</Typography>
                        <div className="score">{noStegarMultipler + 'X'}</div>
                    </Box>
                }
                {fullStegeMultipler > 1 &&
                    <Box sx={{ marginBottom: "25px" }}>
                        <Typography variant="h6">Komplett stege (1-9)</Typography>
                        <div className="score">{fullStegeMultipler + 'X'}</div>
                    </Box>
                }
                {oneKindMultipler > 1 &&
                    <Box sx={{ marginBottom: "25px" }}>
                        <Typography variant="h6">Enbart en sort</Typography>
                        <div className="score">{oneKindMultipler + 'X'}</div>
                    </Box>
                }
                {oneKindAndDragonsMultipler > 1 &&
                    <Box sx={{ marginBottom: "25px" }}>
                        <Typography variant="h6">Enbart end sort + (drakar/vindar)</Typography>
                        <div className="score">{oneKindAndDragonsMultipler + 'X'}</div>
                    </Box>
                }
                {allHiddenMultipler > 1 &&
                    <Box sx={{ marginBottom: "25px" }}>
                        <Typography variant="h6">Enbart dolda brickor</Typography>
                        <div className="score">{allHiddenMultipler + 'X'}</div>
                    </Box>
                }

            </>}
            {dragonsMultipler > 1 &&
                <Box sx={{ marginBottom: "25px" }}>
                    <Typography variant="h6">Tretal/fyrtal drakar</Typography>
                    <div className="score">{dragonsMultipler + 'X'}</div>
                </Box>
            }
            {windMultiplier > 1 &&
                <Box sx={{ marginBottom: "25px" }}>
                    <Typography variant="h6">Tretal/fyrtal eget vädersträck</Typography>
                    <div className="score">{windMultiplier + 'X'}</div>
                </Box>
            }
            {threeHiddenMultipler > 1 &&
                <Box sx={{ marginBottom: "25px" }}>
                    <Typography variant="h6">Tre dolda tretal/fyrtal</Typography>
                    <div className="score">{threeHiddenMultipler + 'X'}</div>
                </Box>
            }

            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: "#F6F6F6", padding: "10px" }}>
                <Typography variant="h6">Total poäng</Typography>
                {totalScore >= 300 ?
                    <>
                        <Typography variant="h6">Limit hand! 300p ({totalScore}p)</Typography>
                    </> :
                <Typography variant="h6">{totalScore}p</Typography>}
            </Box>
            <p>
                Extra X2 vid mahjong på sista brickan i spelet eller extrabricka vid fyrtal ej med
            </p>
        </Box>
    );
}
