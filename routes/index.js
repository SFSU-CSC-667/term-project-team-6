const express = require('express');
const db = require('../bin/db/db');
const router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
    // let testDB = "no connection";
    // let select = {
    //     column: 'Column Name',
    //         table: 'Table Name'
    // };
    // db.select(select, onSuccess);
    //
    res.render('index', {title: 'Express'});
});

router.post('/login', function (req, res, next) {
    const username = req.body.username;
    const pass = req.body.password;

    db.battleshipDB.one("select * from player where username=$1 and password=$2 and is_logged_in=false", [username, pass])
        .then(function (data) {
            // console.log("user found: ", data);
            res.json({success: true, user: data})
        })
        .catch(function (error) {
            console.log("Catch: " + error);
            res.status(403).json({title: 'Login', login_result: error, message: "Login failed", success: false});
        });
});

router.post('/register', function (req, res, next) {
    const username = req.body.username;
    const pass = req.body.password;

    console.log("inserting username: "+username); // print new user id;

    db.battleshipDB.one("insert into player(username, password) values($1, $2) returning id", [username, pass])
        .then(function (data) {
            console.log(data.id); // print new user id;
            res.render('index', {title: 'Login', login_result: data, message: "Registration successful"});
        })
        .catch(function (error) {
            console.log("ERROR:", error.message || error); // print error;
            res.render('index', {title: 'Login', login_result: error, message: "Registration failed"});
        })
});

router.post('/submit/board', function (req, res, next) {

});

module.exports = router;
