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

exports.up = function (db, callback) {
  db.runSql(
      `CREATE TABLE RoundComments (
      GAME_ID VARCHAR(128) NOT NULL,
      ROUND INT NOT NULL,
      COMMENT TEXT NULL,
      PRIMARY KEY (GAME_ID, ROUND)
    ) DEFAULT CHARSET=utf8mb3;`,
      callback
  );
};

exports.down = function (db, callback) {
  db.runSql(`DROP TABLE RoundComments;`, callback);
};

exports._meta = {
  "version": 1
};
