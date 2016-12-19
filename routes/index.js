const express = require('express');
const db = require('../bin/db/db');
// const passwordHash = require('password-hash');

const bcrypt = require('bcrypt');
const saltRounds = 10;

const router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('index', {title: 'Express'});
});

router.get('/login', function (req, res, next) {
    res.render('index', {title: 'Express'});
});

router.get('/register', function (req, res, next) {
    res.render('index', {title: 'Express'});
});

router.post('/login', function (req, res, next) {
    const username = req.body.username;
    const pass = req.body.password;

    db.battleshipDB.one("select * from player where username=$1 and is_logged_in=false", [username])
        .then(function (data) {
            console.log("user found: ", data, pass, data.password);
            bcrypt.compare(pass, data.password, function (err, passwordValid) {
                console.log("err: ", err);
                console.log("passValid: ", passwordValid);
                if (!passwordValid)
                    res.json({success: false, user: data, message: "User found, but wrong password"});
                else
                    res.json({success: true, user: data})
            });

        })
        .catch(function (error) {
            console.log("Catch: " + error);
            res.status(403).json({
                title: 'Login', login_result: error,
                message: "Login failed, user not found", success: false
            });
        });
});

router.post('/register', function (req, res, next) {
    const username = req.body.username;
    const pass = req.body.password;
    bcrypt.hash(pass, saltRounds, function (err, hash) {
        console.log("inserting username: " + username); // print new user id;

        db.battleshipDB.one("insert into player(username, password) values($1, $2) returning id",
            [username, hash])
            .then(function (data) {
                console.log(data.id); // print new user id;
                res.render('index', {
                    title: 'Login',
                    login_result: data, message: "Registration successful"
                });
                db.battleshipDB.none("INSERT INTO high_score(user_id) VALUES ($1)", [data.id])
                    .then(function (success) {
                        console.log("successfully added to high score table", success);
                    })
                    .catch(function (err) {
                        console.log("error adding to highscore table", err);
                    })
            })
            .catch(function (error) {
                console.log("ERROR:", error.message || error); // print error;
                res.render('index', {
                    title: 'Login',
                    login_result: error, message: "Registration failed"
                });
            })
    });


});

module.exports = router;
