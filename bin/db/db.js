/**
 * Created by dusan_cvetkovic on 11/28/16.
 */

const promise = require('bluebird');

let options = {
    // Initialization Options
    promiseLib: promise
};

const pgp = require('pg-promise')(options);

const cn = {
    host: 'localhost',
    port: 5432,
    database: 'battleship',
    user: 'postgres',
    password: ''
};

let dbConnectionString;
if (process.env.DATABASE_URL){
    dbConnectionString = process.env.DATABASE_URL;
    pgp.pg.defaults.ssl = true;
}
else{
    dbConnectionString = "postgres://postgres:@localhost:5432/battleship";
}

// console.log(dbConnectionString);

const battleshipDB = pgp(dbConnectionString);

//battleshipDB.prototype.select = function (colTableObj) {
//    battleshipDB.any('SELECT ${column~} FROM ${table~}', colTableObj)
//        .then()
//        .catch()
//    ;
//};

module.exports = {battleshipDB, pgp};