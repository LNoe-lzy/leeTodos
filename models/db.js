/**
 * Created by lizongyuan on 16/3/5.
 */
var settings = require('../settings'),
    mongodb = require('mongodb'),
    Db = mongodb.Db,
    Connection = mongodb.Connection,
    Server = mongodb.Server;
module.exports = new Db(settings.db, new Server(settings.host, 27017), {safe: true});
