"use client"
import React, { useState, useEffect } from "react";
import { Box, Typography, Slider, Select, MenuItem, Checkbox, FormControlLabel, FormControl, InputLabel, SelectChangeEvent} from "@mui/material";
import { useTranslations } from "next-intl";
import type messages from "../../../messages/sv.json";

/** A combination, named by its key in scoreCalculator.combos in messages/sv.json. */
type ComboId = keyof typeof messages.scoreCalculator.combos;

/** The choices for the four sets, in menu order; null is a divider. */
const SET_OPTIONS: (ComboId | null)[] = [
    "none", null,
    "chow", null,
    "pungLow", "pungHigh", "pungOtherWind", "pungOwnWind", "pungDragons", null,
    "kongLow", "kongHigh", "kongOtherWind", "kongOwnWind", "kongDragons",
];
const PAIR_OPTIONS: (ComboId | null)[] = ["noPair", null, "otherPair", "pairDragons", "pairOwnWind"];

const PUNGS: ComboId[] = ["pungLow", "pungHigh", "pungOtherWind", "pungOwnWind", "pungDragons"];
const KONGS: ComboId[] = ["kongLow", "kongHigh", "kongOtherWind", "kongOwnWind", "kongDragons"];
const isEmpty = (combo: ComboId) => combo === "none" || combo === "noPair";
const isPungOrKong = (combo: ComboId) => PUNGS.includes(combo) || KONGS.includes(combo);

export default function ScoreCalculatorPage() {
    const t = useTranslations("scoreCalculator");
    const [flowers, setFlowers] = useState(0);

    const [combos, setCombos] = useState<{ name: ComboId; isHidden: boolean }[]>([
        {name: "none", isHidden: false},
        {name: "none", isHidden: false},
        {name: "none", isHidden: false},
        {name: "none", isHidden: false},
        {name: "noPair", isHidden: false},
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
        if (combos.filter((combo) => combo.isHidden && isPungOrKong(combo.name)).length > 2) {
            scoreMultiplier *= 2;
        }

        setThreeHiddenMultipler(scoreMultiplier);
    }, [combos]);

    useEffect(() => {
        let scoreMultiplier = 1;

        combos.filter((combo) =>
            combo.name === "pungOwnWind" ||
            combo.name === "kongOwnWind")
            .forEach(_combo => scoreMultiplier *= 2);

        setWindMultiplier(scoreMultiplier);
    }, [combos]);

    useEffect(() => {
        let scoreMultiplier = 1;

        combos.filter((combo) =>
            combo.name === "pungDragons" ||
            combo.name === "kongDragons")
            .forEach(_combo => scoreMultiplier *= 2);

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
        combos.filter((combo) => combo.name === "chow").length > 2
            ? 2 : 1);
    }, [combos, isMahjong, isFullStege]);

    useEffect(() => {
        setNoStegarMultipler(isMahjong &&
        combos.filter((combo) => combo.name === "chow").length === 0
            ? 2 : 1);
    }, [combos, isMahjong]);

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
        setIsMahjong(combos.every((combo) => !isEmpty(combo.name)));
    }, [combos]);

    useEffect(() => {
        const scoreForCombo = (comboName: ComboId, isHidden: boolean) => {
            let comboScore = 0;
            if (comboName === "pungLow") {
                comboScore = 2;
            } else if (PUNGS.includes(comboName)) {
                comboScore = 4;
            } else if (comboName === "kongLow") {
                comboScore = 8;
            } else if (KONGS.includes(comboName)) {
                comboScore = 16;
            }

            if (isHidden) {
                // Should not affect pairs
                comboScore *= 2;
            }
            if (comboName === "pairDragons" ||
                comboName === "pairOwnWind") {
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

    const handleFlowerChange = (ignore: any, newValue: number | number[]) => {
        setFlowers(newValue as number);
    };

    const handleComboChange = (index: number, event: SelectChangeEvent<ComboId>) => {
        const newCombos = [...combos];
        newCombos[index].name = event.target.value as ComboId;
        setCombos(newCombos);
    };

    const handleHiddenChange = (index: number, event: React.ChangeEvent<HTMLInputElement>) => {
        const newCombos = [...combos];
        newCombos[index].isHidden = event.target.checked;
        setCombos(newCombos);
    };

    return (
        <Box>
            <h1 style={{ paddingBottom: "20px" }}>
                {t("title")}
            </h1>
            <Box sx={{marginBottom: "25px"}}>
                <Typography variant="h6">{t("hand")}</Typography>
                <Box className="score-calculator-row">
                    <Slider value={flowers}
                            onChange={handleFlowerChange}
                            min={0}
                            max={8}
                            sx={{
                                width: "250px",
                                marginLeft: "20px",
                                marginRight: "15px"
                            }}/>
                    <Typography style={{
                        marginLeft: "10px",
                        fontSize: "1.5em",
                        color: "var(--header-color)"
                    }}>{t("flowers", {count: flowers})}</Typography>
                    {flowerScore > 0 &&
                        <span style={{textAlign: "right", fontSize: "1.5em", color: "var(--header-color)"}}>
                            {t("points", {score: flowerScore})}
                        </span>}
                </Box>
                {combos.map((combo, index) => (
                    <Box key={index}
                         className="score-calculator-row"
                         sx={{
                             background: isEmpty(combo.name) ? "var(--score-not-selected-background)" : "var(--score-selected-background)",
                         }}>
                        <FormControl sx={{width: "280px", margin: "10px"}}>
                            <InputLabel id={"combo-label-" + index}>{t("combination", {number: index + 1})}</InputLabel>
                            <Select value={combo.name}
                                    labelId={"combo-label-" + index}
                                    id={"combo-" + index}
                                    label={t("combination", {number: index + 1})}
                                    onChange={(event) => handleComboChange(index, event)}>
                                {(index < 4 ? SET_OPTIONS : PAIR_OPTIONS).map((option, optionIndex) => option === null
                                    ? <MenuItem key={optionIndex} disabled>------</MenuItem>
                                    : <MenuItem key={option} value={option}>{t(`combos.${option}`)}</MenuItem>)}
                            </Select>

                        </FormControl>
                        <FormControlLabel control={<Checkbox checked={combo.isHidden}
                                                             onChange={(event) => handleHiddenChange(index, event)}/>}
                                          label={t("hidden")}/>
                        {comboScore[index] > 0 &&
                            <span style={{textAlign: "right", fontSize: "1.5em", color: "var(--header-color)"}}>
                            {t("points", {score: comboScore[index]})}
                        </span>}
                    </Box>
                ))}
            </Box>
            {isMahjong &&
                <>
                    <Box className="score-calculator-row-small">
                        <Typography variant="h6">{t("mahjong")}</Typography>
                        <div className="score">{t("points", {score: mahjongScore})}</div>
                    </Box>
                    {selfTouchScore > 0 &&
                        <Box className="score-calculator-row-small">
                            <Typography variant="h6">{t("selfTouch")}</Typography>
                            <div className="score">{t("points", {score: selfTouchScore})}</div>
                        </Box>}
                    {noScorePoints > 0 &&
                        <Box className="score-calculator-row-small">
                            <Typography variant="h6">{t("noScoreMahjong")}</Typography>
                            <div className="score">{t("points", {score: noScorePoints})}</div>
                        </Box>
                    }
                    {almostSelfTouchPoints > 0 &&
                        <Box className="score-calculator-row-small">
                            <Typography variant="h6">{t("almostSelfTouch")}</Typography>
                            <div className="score">{t("points", {score: almostSelfTouchPoints})}</div>
                        </Box>
                    }
                    <Box className="score-calculator-row-small">
                        <FormControlLabel control={<Checkbox checked={isSelfTouch}
                                                             onChange={(event) => setIsSelfTouch(event.target.checked)}/>}
                                          label={t("selfTouchCheckbox")}/>
                    </Box>
                </>}
            <Box sx={{marginBottom: "25px"}}>
                <Typography variant="h6">{t("multipliers")}</Typography>
            </Box>
            {isMahjong && <>
                <Box className="score-calculator-row-small">
                    <FormControlLabel control={<Checkbox checked={isFullStege}
                                                         onChange={(event) => setIsFullStege(event.target.checked)}/>}
                                      label={t("fullChowCheckbox")}/>
                    <FormControlLabel
                        control={<Checkbox checked={isEnSort} onChange={(event) => setIsEnSort(event.target.checked)}/>}
                        label={t("halfFlushCheckbox")}/>
                    <FormControlLabel control={<Checkbox checked={isEnSortEnbart}
                                                         onChange={(event) => setIsEnSortEnbart(event.target.checked)}/>}
                                      label={t("fullFlushCheckbox")}/>
                </Box>
                {noStegarMultipler > 1 &&
                    <Box className="score-calculator-row-small">
                        <Typography variant="h6">{t("noChows")}</Typography>
                        <div className="score">{t("multiplier", {value: noStegarMultipler})}</div>
                    </Box>
                }
                {fullStegeMultipler > 1 &&
                    <Box className="score-calculator-row-small">
                        <Typography variant="h6">{t("fullChow")}</Typography>
                        <div className="score">{t("multiplier", {value: fullStegeMultipler})}</div>
                    </Box>
                }
                {oneKindMultipler > 1 &&
                    <Box className="score-calculator-row-small">
                        <Typography variant="h6">{t("fullFlush")}</Typography>
                        <div className="score">{t("multiplier", {value: oneKindMultipler})}</div>
                    </Box>
                }
                {oneKindAndDragonsMultipler > 1 &&
                    <Box className="score-calculator-row-small">
                        <Typography variant="h6">{t("halfFlush")}</Typography>
                        <div className="score">{t("multiplier", {value: oneKindAndDragonsMultipler})}</div>
                    </Box>
                }
                {allHiddenMultipler > 1 &&
                    <Box className="score-calculator-row-small">
                        <Typography variant="h6">{t("allHidden")}</Typography>
                        <div className="score">{t("multiplier", {value: allHiddenMultipler})}</div>
                    </Box>
                }

            </>}
            {dragonsMultipler > 1 &&
                <Box className="score-calculator-row-small">
                    <Typography variant="h6">{t("dragons")}</Typography>
                    <div className="score">{t("multiplier", {value: dragonsMultipler})}</div>
                </Box>
            }
            {windMultiplier > 1 &&
                <Box className="score-calculator-row-small">
                    <Typography variant="h6">{t("ownWind")}</Typography>
                    <div className="score">{t("multiplier", {value: windMultiplier})}</div>
                </Box>
            }
            {threeHiddenMultipler > 1 &&
                <Box className="score-calculator-row-small">
                    <Typography variant="h6">{t("threeHidden")}</Typography>
                    <div className="score">{t("multiplier", {value: threeHiddenMultipler})}</div>
                </Box>
            }

            <Box className="score-calculator-row-small">
                <Typography variant="h6">{t("total")}</Typography>
                {totalScore >= 300 ?
                    <span className="score">{t("limitHand", {score: totalScore})}</span> :
                    <span className="score">{t("points", {score: totalScore})}</span>}
            </Box>
            <p style={{marginTop: "20px", fontStyle: "italic"}}>
                {t("footnote")}
            </p>
        </Box>
    );
}
