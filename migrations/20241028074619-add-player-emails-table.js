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
    CREATE TABLE \`PlayerEmails\` (
      \`PLAYER_ID\` varchar(128) NOT NULL,
      \`EMAIL\` varchar(256) NOT NULL,
      PRIMARY KEY (\`PLAYER_ID\`, \`EMAIL\`),
      UNIQUE KEY \`EMAIL_UNIQUE\` (\`EMAIL\`),
      KEY \`PLAYER_INDEX\` (\`PLAYER_ID\`)
    ) DEFAULT CHARSET=utf8mb3;
  `;
  db.runSql(sql, callback);
};

exports.down = function(db, callback) {
  const sql = 'DROP TABLE IF EXISTS \`PlayerEmails\`;';
  db.runSql(sql, callback);
};

exports._meta = {
  "version": 1
};
