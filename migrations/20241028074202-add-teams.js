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
    CREATE TABLE IF NOT EXISTS \`Teams\` (
      \`TEAM_ID\` varchar(128) NOT NULL DEFAULT '',
      \`PLAYER_ID\` varchar(128) NOT NULL,
      \`IS_SINGLE_PLAYER\` tinyint(1) NOT NULL,
      \`IS_TEST\` tinyint(1) NOT NULL DEFAULT '0',
      PRIMARY KEY (\`TEAM_ID\`, \`PLAYER_ID\`),
      KEY \`PLAYER_INDEX\` (\`PLAYER_ID\`)
    ) DEFAULT CHARSET=utf8mb3;
  `;
  db.runSql(sql, callback);
};

exports.down = function(db, callback) {
  const sql = 'DROP TABLE IF EXISTS \`Teams\`;';
  db.runSql(sql, callback);
};


exports._meta = {
  "version": 1
};
