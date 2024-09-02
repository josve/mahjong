"use server";

import Connection from "@/lib/connection";

export async function getMatchById(id: string): Promise<any> {
  const connection = await Connection.getInstance().getConnection();
  try {
    const [rows] = await connection.query(
      "SELECT *, (SELECT COUNT(*) From Games g where g.TIME < Games.TIME) as GAME_IDX FROM Games WHERE GAME_ID = ?",
      [id]
    );
    return rows[0];
  } finally {
    connection.release();
  }
}

export async function getHandsByGameId(id: string): Promise<any> {
  const connection = await Connection.getInstance().getConnection();
  try {
    const [hands] = await connection.query(
      "SELECT * FROM Hands WHERE GAME_ID = ? ORDER BY ROUND ASC",
      [id]
    );
    return hands;
  } finally {
    connection.release();
  }
}

export async function getTeamIdToNameNoAlias() {
  const connection = await Connection.getInstance().getConnection();
  try {
    const [result] = await connection.query(
      "SELECT COALESCE(GROUP_CONCAT(Players.NAME order by Players.NAME separator '+')) as NAME, Teams.TEAM_ID from Teams \
     INNER JOIN \
     Players \
     ON \
     Players.PLAYER_ID = Teams.PLAYER_ID \
     GROUP BY Teams.TEAM_ID"
    );

    // Convert the result to an object with the team_id as the key and the name as the value
    const teamIdToName = result.reduce((acc: any, row: any) => {
      acc[row.TEAM_ID] = row.NAME;
      return acc;
    }, {});

    return teamIdToName;
  } finally {
    connection.release();
  }
}

export async function getTeamIdToName() {
  const connection = await Connection.getInstance().getConnection();
  try {
    const [result] = await connection.query(
      "SELECT COALESCE(MAX(TeamAttributes.`VALUE`), GROUP_CONCAT(Players.NAME order by Players.NAME separator '+')) as NAME, Teams.TEAM_ID from Teams \
   LEFT OUTER JOIN \
   TeamAttributes \
   ON \
   TeamAttributes.`TEAM_ID` = Teams.TEAM_ID \
   INNER JOIN \
   Players \
   ON \
   Players.PLAYER_ID = Teams.PLAYER_ID \
   WHERE \
    TeamAttributes.ATTRIBUTE IS NULL OR TeamAttributes.ATTRIBUTE = 'alias' \
   GROUP BY Teams.TEAM_ID"
    );

    // Convert the result to an object with the team_id as the key and the name as the value
    const teamIdToName = result.reduce((acc: any, row: any) => {
      acc[row.TEAM_ID] = row.NAME;
      return acc;
    }, {});

    return teamIdToName;
  } finally {
    connection.release();
  }
}
