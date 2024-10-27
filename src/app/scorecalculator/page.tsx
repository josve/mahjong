"use client"
import React, { useState } from "react";
import { Box, Typography, Slider, Select, MenuItem, Checkbox, FormControlLabel, FormControl, InputLabel } from "@mui/material";
import { Metadata } from "next";

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
        let flowerScore = flowers * 4;
        totalScore += flowerScore;

        const scoreForCombo = (comboName: string, isHidden: boolean) => {
            let comboScore = 0;
            if (comboName.includes("Tretal låg")) comboScore = 2;
            if (comboName.includes("Tretal hög") || comboName.includes("Tretal annan vind") || comboName.includes("Tretal egen vind") || comboName.includes("Tretal drakar")) comboScore = 4;
            if (comboName.includes("Fyrtal låg")) comboScore = 8;
            if (comboName.includes("Fyrtal hög") || comboName.includes("Fyrtal annan vind") || comboName.includes("Fyrtal egen vind") || comboName.includes("Fyrtal drakar")) comboScore = 16;
            if (isHidden) comboScore *= 2;
            if (comboName.includes("Par drakar") || comboName.includes("Par egen vind")) comboScore = 2;
            return comboScore;
        };

        combos.forEach((combo) => {
            const comboScoreToAdd = scoreForCombo(combo.name, combo.isHidden);
            totalScore += comboScoreToAdd;
        });

        console.log("After combos: " + totalScore);

        let isMahjong = false;

        if (combos.every((combo) => combo.name !== "(Inget)" && combo.name !== "(Inget par)")) {
            isMahjong = true;
            console.log("is mahjong");
            totalScore += 10;
            if (totalScore === 0) {
                console.log("No score points");
                totalScore += 10;
            }
            if (isSelfTouch) {
                console.log("self touch");
                totalScore += 2;
            }
            if (combos.filter((combo) => combo.isHidden).length === 4 && !isSelfTouch)  {
                console.log("almost self touch");
                totalScore += 2;
            }
        }

        let scoreMultiplier = 1;

        if (isMahjong) {
            if (combos.filter((combo) => combo.name.includes("Stege")).length === 0) {
                console.log("inga stegar");
                scoreMultiplier *= 2;
            }
            if (combos.filter((combo) => combo.name.includes("Stege")).length > 2 && isFullStege) {
                console.log("full stege");
                scoreMultiplier *= 2;
            }
            if (isEnSort) {
                console.log("Only one kind + dragons");
                scoreMultiplier *= 2;
            }
            if (isEnSortEnbart) {
                console.log("Only one kind");
                scoreMultiplier *= 8;

            }
            if (combos.every((combo) => combo.isHidden)) {
                scoreMultiplier *= 2; // Dold Mahjong multiplier
            }

        }
        if (combos.filter((combo) => combo.name.includes("Tretal drakar")).length > 0) {
            console.log("Drakar");
            scoreMultiplier *= 2;
        }
        if (combos.filter((combo) => combo.name.includes("Fyrtal drakar")).length > 0) {
            console.log("Drakar");
            scoreMultiplier *= 2;
        }
        if (combos.filter((combo) => combo.name.includes("Fyrtal egen vind")).length > 0)  {
            console.log("Egen vind");
            scoreMultiplier *= 2;
        }
        if (combos.filter((combo) => combo.name.includes("Tretal egen vind")).length > 0)  {
            console.log("Egen vind");
            scoreMultiplier *= 2;
        }
        if (combos.filter((combo) => combo.isHidden && (combo.name.includes("Tretal") || combo.name.includes("Fyrtal"))).length > 2) {
            scoreMultiplier *= 2;
        }

        totalScore *= scoreMultiplier;
        return totalScore;
    };

    return (
        <Box sx={{ padding: "40px", maxWidth: "800px", margin: "0 auto" }}>
            <Typography variant="h4" gutterBottom>Poängräknare</Typography>
            <Box sx={{ marginBottom: "25px" }}>
                <Typography variant="h6">Hand</Typography>
                <Box sx={{ display: "flex", alignItems: "center", marginBottom: "8px", background: "#F6F6F6", padding: "10px" }}>
                    <Slider value={flowers} onChange={handleFlowerChange} min={0} max={8} sx={{ width: "250px", marginRight: "15px" }} />
                    <Typography>{flowers} blommor</Typography>
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
                    </Box>
                ))}
            </Box>
            <Box sx={{ marginBottom: "25px" }}>
                <Typography variant="h6">Mahjong</Typography>
                <FormControlLabel control={<Checkbox checked={isSelfTouch} onChange={(event) => setIsSelfTouch(event.target.checked)} />} label="Mahjong på dragen bricka (self touch)" />
            </Box>
            <Box sx={{ marginBottom: "25px" }}>
                <Typography variant="h6">Multiplikatorer</Typography>
                <FormControlLabel control={<Checkbox checked={isFullStege} onChange={(event) => setIsFullStege(event.target.checked)} />} label="Stege 1-9 av en sort" />
                <FormControlLabel control={<Checkbox checked={isEnSort} onChange={(event) => setIsEnSort(event.target.checked)} />} label="En sort + vindar/drakar" />
                <FormControlLabel control={<Checkbox checked={isEnSortEnbart} onChange={(event) => setIsEnSortEnbart(event.target.checked)} />} label="En sort enbart" />
            </Box>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: "#F6F6F6", padding: "10px" }}>
                <Typography variant="h6">Total poäng</Typography>
                <Typography variant="h6">{calculateScore()}p</Typography>
            </Box>
            <p>
                Extra X2 vid mahjong på sista brickan i spelet eller extrabricka vid fyrtal ej med
            </p>
        </Box>
    );
}
