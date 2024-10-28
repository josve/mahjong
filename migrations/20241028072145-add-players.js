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
    CREATE TABLE IF NOT EXISTS \`Players\` (
      \`PLAYER_ID\` varchar(128) NOT NULL,
      \`NAME\` varchar(128) NOT NULL,
      \`COLOR_RED\` double DEFAULT NULL,
      \`COLOR_BLUE\` double DEFAULT NULL,
      \`COLOR_GREEN\` double DEFAULT NULL,
      \`IS_TEST\` tinyint(1) NOT NULL DEFAULT '0',
      PRIMARY KEY (\`PLAYER_ID\`, \`NAME\`),
      KEY \`ID_INDEX\` (\`PLAYER_ID\`)
    ) DEFAULT CHARSET=utf8mb3;
  `;
  db.runSql(sql, callback);
};

exports.down = function(db, callback) {
  const sql = 'DROP TABLE IF EXISTS \`Players\`;';
  db.runSql(sql, callback);
};

exports._meta = {
  "version": 1
};
