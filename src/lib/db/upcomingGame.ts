"use server";

import Connection from "@/lib/connection";
import { UpcomingGame } from "@/types/db";
import moment from 'moment';

export async function getNextUpcomingGame(): Promise<UpcomingGame | null> {
    const connection = await Connection.getInstance().getConnection();
    try {
        const [result]: any = await connection.query(`
      SELECT id, game_time, meeting_link, created_at
      FROM upcoming_games
      WHERE game_time > NOW()
      ORDER BY game_time ASC
      LIMIT 1
    `);

        return result.length > 0 ? result[0] : null;
    } finally {
        connection.release();
    }
}

export async function getAllUpcomingGames(): Promise<UpcomingGame[]> {
    const connection = await Connection.getInstance().getConnection();
    try {
        const [result]: any = await connection.query(`
      SELECT id, game_time, meeting_link, created_at
      FROM upcoming_games
      WHERE game_time > NOW()
      ORDER BY game_time ASC
    `);

        return result;
    } finally {
        connection.release();
    }
}


export async function createUpcomingGame(gameTime: Date, meetingLink?: string | null): Promise<number> {
    const connection = await Connection.getInstance().getConnection();
    try {
        const [result]: any = await connection.query(
            `
      INSERT INTO upcoming_games (game_time, meeting_link)
      VALUES (?, ?)
      `,
            [moment(gameTime).format('YYYY-MM-DD HH:mm:ss'), meetingLink || null]
        );

        return result.insertId; // Return the ID of the new game
    } finally {
        connection.release();
    }
}

export async function updateUpcomingGame(gameId: number, gameTime: Date, meetingLink?: string | null): Promise<boolean> {
    const connection = await Connection.getInstance().getConnection();
    try {
        const [result]: any = await connection.query(
            `
      UPDATE upcoming_games
      SET game_time = ?, meeting_link = ?
      WHERE id = ?
      `,
            [moment(gameTime).format('YYYY-MM-DD HH:mm:ss'), meetingLink || null, gameId]
        );

        return result.affectedRows > 0; // Return true if the update was successful
    } finally {
        connection.release();
    }
}

export async function deleteUpcomingGame(gameId: number): Promise<boolean> {
    const connection = await Connection.getInstance().getConnection();
    try {
        const [result]: any = await connection.query(
            `
      DELETE FROM upcoming_games
      WHERE id = ?
      `,
            [gameId]
        );

        return result.affectedRows > 0; // Return true if a game was deleted
    } finally {
        connection.release();
    }
}