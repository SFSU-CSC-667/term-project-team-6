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

    db.battleshipDB.one("select * from player where username=$1 and password=$2", [username, pass])
        .then(function (data) {
            console.log("then", data);
            // res.render('index', {title: 'Login', login_result: data, message: "Login successful"});
            // res.redirect('/game?id='+data.id || data)
            res.json({success: true, user: data})
        })
        .catch(function (error) {
            console.log("Catch: " + error);
            // res.render('index', {title: 'Login', login_result: error, message: "Login failed"});
            res.status(403).json({title: 'Login', login_result: error, message: "Login failed", success: false});
        });
});

router.post('/register', function (req, res, next) {
    const username = req.body.username;
    const pass = req.body.password;

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

// router.get('/login', function (req, res, next) {
//     res.render('index', {title: 'Login'});
// });

// router.get('/register', function (req, res, next) {
//     res.render('index', {title: 'Login'});
// });

router.post('/submit/board', function (req, res, next) {
    const boardState = JSON.parse(req.body.board);
    const user = JSON.parse(req.body.user);
    const gameId = req.body.game_id;
    if (!boardState || !user || !gameId)
        res.json({success: false});
    // console.log(body);

    // const shipColumnSet = new db.pgp.helpers.ColumnSet(["ship_owner", "size"],
    //                 {table: 'user'});
    //
    // const shipQuery = db.pgp.helpers.insert(values, shipColumnSet);

    // boardState.forEach(function (shipID) {
    //
    // });
    let shipNumber = Object.keys(boardState).length;
    console.log("ships number: ", boardState);
    for (let ship in boardState) {
        // console.log(boardState[ship]);
        console.log("inserting :%s for user %s", ship, user.username);
        db.battleshipDB.one("insert into ship(ship_owner, size) values($1, $2) returning id",
            [user.id, boardState[ship].length])
            .then(function (data) {
                console.log("inserted ship id: " + data.id);

                // more on how to optimize this:
                // http://stackoverflow.com/questions/37300997/multi-row-insert-with-pg-promise
                const cs = new db.pgp.helpers.ColumnSet(["game_id", "player_id", "ship_id", "position_x", "position_y"],
                    {table: 'board_state'});

                // input values:
                const values = [];
                boardState[ship].forEach(function (shipPos) {
                    // console.log(shipPos);
                    const boardPositionData = {};
                    boardPositionData.game_id = parseInt(gameId);
                    boardPositionData.player_id = user.id;
                    boardPositionData.ship_id = data.id;
                    boardPositionData.position_x = shipPos.row;
                    boardPositionData.position_y = shipPos.column;

                    values.push(boardPositionData);
                });

                // console.log(values);
                // generating a multi-row insert query:
                const query = db.pgp.helpers.insert(values, cs);

                db.battleshipDB.none(query)
                    .then(function () {
                        console.log("inserted player id: %s - game id: %s, shipID: %s",
                            user.id, gameId, data.id);
                        shipNumber--;
                        console.log(shipNumber);
                        if (shipNumber==0)
                            res.json({success: true, message: "database updated"});
                    })
                    .catch(error => {
                        console.log("board state update ERROR:", error.message || error);
                        shipNumber--;
                        console.log(shipNumber);
                        if (shipNumber==0)
                            res.json({success: false, message: "error happen"});
                    });
            })
            .catch(function (error) {
                console.log("ships update ERROR:", error.message || error); // print error;
                // res.render('index', {title: 'Login', login_result: error, message: "Registration failed"});
            })
    }
    return;


    db.tx(function (t) {
        // `t` and `this` here are the same;
        // this.ctx = transaction config + state context;
        return t.batch([
            t.none("update users set active=$1 where id=$2", [true, 123]),
            t.none("insert into audit(status, id) values($1, $2)", ['active', 123])
        ]);
    })
        .then(function (data) {
            // success;
        })
        .catch(function (error) {
            console.log("ERROR:", error.message || error);
        });
});

module.exports = router;
