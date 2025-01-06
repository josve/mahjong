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
  db.createTable('upcoming_games', {
    id: { type: 'int', primaryKey: true, autoIncrement: true },
    game_time: { type: 'datetime', notNull: true },
    meeting_link: { type: 'string', length: 255, notNull: false },
    created_at: { type: 'timestamp', defaultValue: new String('CURRENT_TIMESTAMP') }
  }, callback);
};

exports.down = function (db, callback) {
  db.dropTable('upcoming_games', callback);
};

exports._meta = {
  "version": 1
};
