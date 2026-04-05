"use server"
import OpenAI from "openai";
import Connection from "@/lib/connection";
import {getHandsByGameId, getMatchById, getTeamColors, getTeamIdToName} from "@/lib/dbMatch";
import { Hand, IdToName } from "@/types/db";

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY, // Set this in your .env.local file
});

function createDetailedHandTable(hands: Hand[], teamIdToName: IdToName): string {
    const rows = [
        "Runda;Lagnamn;Handpoäng;Vinnare;Vind;Poäng"
    ];

    for (const hand of hands.sort((a, b) => a.ROUND - b.ROUND || a.TIME.getTime() - b.TIME.getTime())) {
        const teamName = teamIdToName[hand.TEAM_ID] || hand.TEAM_ID;
        const isWinner = hand.IS_WINNER ? "Ja" : "Nej";
        const wind = hand.WIND || "-";
        rows.push(`${hand.ROUND};${teamName};${hand.HAND};${isWinner};${wind};${hand.HAND_SCORE}`);
    }

    return rows.join("\n");
}

export async function generateRoundComment(gameId: string, round: number): Promise<string> {
    const connection = await Connection.getInstance().getConnection();
    try {

        const [latestRoundResult]: any = await connection.query(
            'SELECT COMMENT FROM RoundComments WHERE GAME_ID = ? AND ROUND = ?',
            [gameId, round]
        );

        if (latestRoundResult[0] && latestRoundResult[0]?.COMMENT) {
            return latestRoundResult[0]?.COMMENT;
        }


    const hands = await getHandsByGameId(gameId);
    const teamIdToName = await getTeamIdToName();
    const match = await getMatchById(gameId);

    if (!match) throw new Error("Game not found");

    const relevantHands = hands.filter((hand) => hand.ROUND <= round);

    const table = createDetailedHandTable(relevantHands, teamIdToName);

    const prompt = `
    Du är en svensk sportskribent med känsla för poesi. Skriv alltid mellan en och fem meningar. Använd inga siffror – skriv dem som ord. Variera ordval, undvik klichéer, och avsluta gärna med ett passande ordspråk med österländsk visdomston.

User:
Uppgift: Skriv en kort, unik kommentar om en mahjongrunda.
Krav:
- Längd: 1–5 meningar.
- Inga siffror, skriv alltid med ord.
- Beskriv känsla och momentum hellre än exakta tal.
- Undvik att upprepa samma fraser i flera meningar.
- Avsluta, om det passar, med ett ordspråk i samma ton.

Stilnyckel: ${round % 7} 
Välj exakt en av följande stilar baserat på Stilnyckel:
0: Poetisk och stillsam, naturmetaforer (dimma, vind, vatten).
1: Sportkommentator, tempo och nerv, korta meningar.
2: Zen-mästare, lugn och aforismer.
3: Folksaga, varm berättarröst och bildspråk.
4: Värdshus-bard, lite dramatisk och lekfull.
5: Taktikern, fokus på vändpunkter och strategi.
6: Haiku-lik rytm (men inga radbrytningar behövs).

Rundan är (${round}). Här är all statistik:
${table}

Svara endast med brödtexten (ingen rubrik).
`;

    // Call OpenAI API
    const completion = await openai.chat.completions.create({
        model: "gpt-5-nano",
        messages: [{ role: "user", content: prompt }],
    });

    const comment = completion.choices[0].message.content;


        // Save comment to DB
        await connection.query(
            `REPLACE INTO RoundComments (GAME_ID, ROUND, COMMENT)
             VALUES (?, ?, ?)`,
            [gameId, round, comment]
        );
        return comment!;
    } finally {
        connection.release();
    }
}

