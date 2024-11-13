"use server";

import Connection from "@/lib/connection";
import {
  Hand,
  IdToColorMap,
  IdToName,
  MatchWithIdx, PlayerOrTeam,
  SimplePlayer,
  TeamIdToDetails,
  TeamIdToPlayerIds,
  TotalStatistics
} from "@/types/db";

export async function getTotalStatistics(): Promise<TotalStatistics> {
  const connection = await Connection.getInstance().getConnection();
  try {
    const [result]: any = await connection.query(`
      SELECT 
        COUNT(DISTINCT Games.GAME_ID) as totalMatches,
        SUM(CASE WHEN IS_WINNER = 1 THEN 1 ELSE 0 END) as totalMahjongs,
        COUNT(distinct concat(ROUND, Games.GAME_ID)) as totalRounds
      FROM Hands INNER JOIN Games ON Hands.GAME_ID = Games.GAME_ID
    `);
    return result[0];
  } finally {
    connection.release();
  }
}

export async function getMatchById(id: string): Promise<MatchWithIdx> {
  const connection = await Connection.getInstance().getConnection();
  try {
    const [rows]: any = await connection.query(
      "SELECT *, (SELECT COUNT(*) From Games g where g.TIME < Games.TIME AND g.IS_TEST = 0) as GAME_IDX FROM Games WHERE GAME_ID = ? AND IS_TEST = 0",
      [id]
    );
    return rows[0];
  } finally {
    connection.release();
  }
}

export async function getTeamAndPlayerColors(): Promise<IdToColorMap> {
  const connection = await Connection.getInstance().getConnection();
  try {
    const [teamResult]: any = await connection.query(
        `SELECT Teams.TEAM_ID, AVG(Players.color_red) as color_red, AVG(Players.color_green) as color_green, AVG(Players.color_blue) as color_blue FROM Teams 
      INNER JOIN Players ON Players.PLAYER_ID = Teams.PLAYER_ID 
      GROUP BY Teams.TEAM_ID`
    );

    const idToColorMap: IdToColorMap  = {};

    for (const row of teamResult) {
      idToColorMap[row.TEAM_ID] = {
        color_red: row.color_red,
        color_green: row.color_green,
        color_blue: row.color_blue,
      }
    }

    const [playerResult]: any = await connection.query(
        "SELECT PLAYER_ID, color_red, color_green, color_blue FROM Players"
    );

    for (const row of playerResult) {
      idToColorMap[row.PLAYER_ID] = {
        color_red: row.color_red,
        color_green: row.color_green,
        color_blue: row.color_blue,
      }
    }

    return idToColorMap;
  } finally {
    connection.release();
  }
}

export async function getTeamColors(): Promise<IdToColorMap> {
  const connection = await Connection.getInstance().getConnection();
  try {
    const [result]: any = await connection.query(
      `SELECT Teams.TEAM_ID, AVG(Players.color_red) as color_red, AVG(Players.color_green) as color_green, AVG(Players.color_blue) as color_blue FROM Teams 
      INNER JOIN Players ON Players.PLAYER_ID = Teams.PLAYER_ID 
      GROUP BY Teams.TEAM_ID`
    );

    // Convert the result to an object with the team_id as the key and the color as the value
    return result.reduce((acc: any, row: any) => {
      acc[row.TEAM_ID] = {
        color_red: row.color_red,
        color_green: row.color_green,
        color_blue: row.color_blue,
      };
      return acc;
    }, {});
  } finally {
    connection.release();
  }
}

export async function getPlayerColors(): Promise<IdToColorMap> {
  const connection = await Connection.getInstance().getConnection();
  try {
    const [result]: any = await connection.query(
      "SELECT PLAYER_ID, color_red, color_green, color_blue FROM Players"
    );

    // Convert the result to an object with the player_id as the key and the color as the value
    return result.reduce((acc: any, row: any) => {
      acc[row.PLAYER_ID] = {
        color_red: row.color_red,
        color_green: row.color_green,
        color_blue: row.color_blue,
      };
      return acc;
    }, {});
  } finally {
    connection.release();
  }
}

export async function getHandsByGameId(id: string): Promise<Hand[]> {
  const connection = await Connection.getInstance().getConnection();
  try {
    const [hands]: any = await connection.query(
      `SELECT * FROM Hands WHERE GAME_ID = ? ORDER BY ROUND ASC`,
      [id]
    );
    return hands;
  } finally {
    connection.release();
  }
}

export async function getTeamIdToName(): Promise<IdToName> {
  const connection = await Connection.getInstance().getConnection();
  try {
    const [result]: any = await connection.query(
      `SELECT COALESCE(MAX(TeamAttributes.\`VALUE\`), GROUP_CONCAT(Players.NAME order by Players.NAME separator '+')) as NAME, Teams.TEAM_ID from Teams 
   LEFT OUTER JOIN 
   TeamAttributes 
   ON 
   TeamAttributes.\`TEAM_ID\` = Teams.TEAM_ID 
   INNER JOIN 
   Players 
   ON 
   Players.PLAYER_ID = Teams.PLAYER_ID 
   WHERE 
    TeamAttributes.ATTRIBUTE IS NULL OR TeamAttributes.ATTRIBUTE = 'alias' 
   GROUP BY Teams.TEAM_ID`
    );

    // Convert the result to an object with the team_id as the key and the name as the value
    return result.reduce((acc: any, row: any) => {
      acc[row.TEAM_ID] = row.NAME;
      return acc;
    }, {});
  } finally {
    connection.release();
  }
}

export async function fetchAllTeamsAndPlayers(): Promise<PlayerOrTeam[]> {
  const connection = await Connection.getInstance().getConnection();
  try {
    const [result]: any = await connection.query(
        "SELECT DISTINCT Players.PLAYER_ID, Players.NAME FROM Players"
    );
    const players = result.map((row: any) => ({ id: row.PLAYER_ID, name: row.NAME }));
    const [teamResult]: any = await connection.query(`
      SELECT 
        Teams.TEAM_ID,
        COALESCE(MAX(TeamAttributes.VALUE), GROUP_CONCAT(Players.NAME ORDER BY Players.NAME SEPARATOR '+')) as NAME
      FROM Teams
      INNER JOIN Players ON Teams.PLAYER_ID = Players.PLAYER_ID
      LEFT OUTER JOIN TeamAttributes ON TeamAttributes.TEAM_ID = Teams.TEAM_ID AND TeamAttributes.ATTRIBUTE = 'alias'
      GROUP BY Teams.TEAM_ID
    `);
    const teams = teamResult.map((row: any) => ({ id: row.TEAM_ID, name: row.NAME }));
    return [...players, ...teams];
  } finally {
    connection.release();
  }
}

export async function getAllPlayers(): Promise<SimplePlayer[]> {
  const connection = await Connection.getInstance().getConnection();
  try {
    const [result]: any = await connection.query(
      "SELECT DISTINCT Players.PLAYER_ID, Players.NAME FROM Players"
    );
    return result.map((row: any) => ({ id: row.PLAYER_ID, name: row.NAME }));
  } finally {
    connection.release();
  }
}

export async function getTeamIdToPlayerIds(): Promise<TeamIdToPlayerIds> {
  const connection = await Connection.getInstance().getConnection();
  try {
    const [result]: any = await connection.query(
      "SELECT Teams.TEAM_ID, Players.PLAYER_ID FROM Teams INNER JOIN Players ON Teams.PLAYER_ID = Players.PLAYER_ID"
    );
    const teamIdToPlayerIds: { [key: string]: string[] } = {};
    result.forEach((row: any) => {
      if (!teamIdToPlayerIds[row.TEAM_ID]) {
        teamIdToPlayerIds[row.TEAM_ID] = [];
      }
      teamIdToPlayerIds[row.TEAM_ID].push(row.PLAYER_ID);
    });
    return teamIdToPlayerIds;
  } finally {
    connection.release();
  }
}

export async function getTeamDetails(): Promise<TeamIdToDetails> {
  const connection = await Connection.getInstance().getConnection();
  try {
    const [result]: any = await connection.query(`
      SELECT 
        Teams.TEAM_ID,
        GROUP_CONCAT(Players.PLAYER_ID) as player_ids,
        COALESCE(MAX(TeamAttributes.VALUE), GROUP_CONCAT(Players.NAME ORDER BY Players.NAME SEPARATOR '+')) as team_name,
        GROUP_CONCAT(Players.NAME ORDER BY Players.NAME SEPARATOR '+') as concatenated_name
      FROM Teams
      INNER JOIN Players ON Teams.PLAYER_ID = Players.PLAYER_ID
      LEFT OUTER JOIN TeamAttributes ON TeamAttributes.TEAM_ID = Teams.TEAM_ID AND TeamAttributes.ATTRIBUTE = 'alias'
      GROUP BY Teams.TEAM_ID
    `);

    const teamDetails: TeamIdToDetails = {};
    result.forEach((row: any) => {
      teamDetails[row.TEAM_ID] = {
        id: row.TEAM_ID,
        playerIds: row.player_ids.split(","),
        teamName: row.team_name,
        concatenatedName: row.concatenated_name,
      };
    });

    return teamDetails;
  } finally {
    connection.release();
  }
}