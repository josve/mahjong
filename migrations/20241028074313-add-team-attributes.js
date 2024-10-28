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
    CREATE TABLE IF NOT EXISTS \`TeamAttributes\` (
      \`TEAM_ID\` varchar(128) NOT NULL,
      \`ATTRIBUTE\` varchar(32) NOT NULL,
      \`VALUE\` varchar(10000) DEFAULT NULL,
      PRIMARY KEY (\`TEAM_ID\`, \`ATTRIBUTE\`)
    ) DEFAULT CHARSET=utf8mb3;
  `;
  db.runSql(sql, callback);
};

exports.down = function(db, callback) {
  const sql = 'DROP TABLE IF EXISTS \`TeamAttributes\`;';
  db.runSql(sql, callback);
};


exports._meta = {
  "version": 1
};
