import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import {createUpcomingGame} from "@/lib/db/upcomingGame";

export async function POST(req: NextRequest) {
    const body = await req.json();
    const { gameTime, meetingLink } = body;

    if (process.env.REQUIRE_LOGIN) {
        const session = await auth();
        if (!session || !session.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
    }

    if (!gameTime) {
        return NextResponse.json({ error: "Game time is required" }, { status: 400 });
    }

    try {
        const resultId = await createUpcomingGame(gameTime, meetingLink);

        return NextResponse.json({ id: resultId, message: "Game created successfully" }, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: "Failed to create game" }, { status: 500 });
    } finally {
    }
}