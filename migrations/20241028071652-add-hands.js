'use strict';

var dbm;
var type;
var seed;

/**
  * We receive the dbmigrate dependency from dbmigrate initially.
  * This enables us to not have to rely on NODE_PATH.
  */
exports.setup = function(options, seedLink) {
  dbm = options.dbmigrate;
  type = dbm.dataType;
  seed = seedLink;
};


exports.up = function(db, callback) {
  const sql = `
    CREATE TABLE IF NOT EXISTS \`Hands\` (
      \`ROUND\` int NOT NULL,
      \`GAME_ID\` varchar(128) NOT NULL,
      \`TIME\` datetime NOT NULL,
      \`HAND\` int NOT NULL,
      \`IS_WINNER\` tinyint(1) DEFAULT NULL,
      \`WIND\` char(1) DEFAULT NULL,
      \`TEAM_ID\` varchar(128) NOT NULL,
      \`HAND_SCORE\` int NOT NULL,
      \`IS_TEST\` tinyint(1) NOT NULL DEFAULT '0',
      PRIMARY KEY (\`ROUND\`, \`GAME_ID\`, \`TEAM_ID\`),
      KEY \`ROUND_INDEX\` (\`ROUND\`),
      KEY \`GAME_INDEX\` (\`GAME_ID\`)
    ) DEFAULT CHARSET=utf8mb3;
  `;
  db.runSql(sql, callback);
};

exports.down = function(db, callback) {
  const sql = 'DROP TABLE IF EXISTS \`Hands\`;';
  db.runSql(sql, callback);
};

exports._meta = {
  "version": 1
};
