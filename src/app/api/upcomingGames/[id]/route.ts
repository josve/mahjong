import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { updateUpcomingGame, deleteUpcomingGame } from "@/lib/db/upcomingGame";

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
    const body = await req.json();
    const { gameTime, meetingLink } = body;
    const gameId = parseInt(params.id, 10);

    if (process.env.REQUIRE_LOGIN) {
        const session = await auth();
        if (!session || !session.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
    }

    if (!gameId || isNaN(gameId)) {
        return NextResponse.json({ error: "Invalid game ID" }, { status: 400 });
    }

    if (!gameTime) {
        return NextResponse.json({ error: "Game time is required" }, { status: 400 });
    }

    try {
        const success = await updateUpcomingGame(gameId, gameTime, meetingLink);

        return success
            ? NextResponse.json({ message: "Game updated successfully" }, { status: 200 })
            : NextResponse.json({ error: "Game not found" }, { status: 404 });
    } catch (error) {
        return NextResponse.json({ error: "Failed to update game" }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
    const gameId = parseInt(params.id, 10);

    if (process.env.REQUIRE_LOGIN) {
        const session = await auth();
        if (!session || !session.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
    }

    if (!gameId || isNaN(gameId)) {
        return NextResponse.json({ error: "Invalid game ID" }, { status: 400 });
    }

    try {
        const success = await deleteUpcomingGame(gameId);

        return success
            ? NextResponse.json({ message: "Game deleted successfully" }, { status: 200 })
            : NextResponse.json({ error: "Game not found" }, { status: 404 });
    } catch (error) {
        return NextResponse.json({ error: "Failed to delete game" }, { status: 500 });
    }
}