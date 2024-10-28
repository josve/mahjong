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
    CREATE TABLE IF NOT EXISTS \`Games\` (
      \`GAME_ID\` varchar(128) NOT NULL,
      \`TIME\` datetime NOT NULL,
      \`NAME\` varchar(256) CHARACTER SET utf8mb3 COLLATE utf8mb3_swedish_ci NOT NULL,
      \`COMMENT\` varchar(1024) CHARACTER SET utf8mb3 COLLATE utf8mb3_swedish_ci DEFAULT NULL,
      \`TEAM_ID_1\` varchar(128) NOT NULL,
      \`TEAM_ID_2\` varchar(128) NOT NULL,
      \`TEAM_ID_3\` varchar(128) NOT NULL,
      \`TEAM_ID_4\` varchar(128) NOT NULL,
      \`IS_TEST\` tinyint(1) NOT NULL DEFAULT '0',
      PRIMARY KEY (\`GAME_ID\`),
      KEY \`NAME_INDEX\` (\`NAME\`),
      KEY \`TIME_INDEX\` (\`TIME\`)
    ) DEFAULT CHARSET=utf8mb3;
  `;
    db.runSql(sql, callback);
};

exports.down = function(db, callback) {
    const sql = 'DROP TABLE IF EXISTS `Games`;';
    db.runSql(sql, callback);
};

exports._meta = {
  "version": 1
};
