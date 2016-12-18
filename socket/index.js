const socketIo = require('socket.io');
const events = require('../frontend/constants/events');
let io;
const db = require('../bin/db/db').battleshipDB;
const pgp = require('../bin/db/db').pgp;

function updateUsers() {

    db.tx(function (t) {
        const q1 = this.any('select * from player where is_logged_in=$1', [true]);
        const q2 = this.any('SELECT * FROM player, game WHERE player1_id=player.id');

        // returning a promise that determines a successful transaction:
        return this.batch([q1, q2]); // all of the queries are to be resolved;
    })
        .then(function (data) {
            const res = {
                usersList: data[0],
                games: data[1]
            };
            io.emit(events.GET_USERS, res);
            // console.log("data from transaction", res); // printing successful transaction output;

        })
        .catch(function (error) {
            console.log("error from transaction", error); // printing the error;
        });
}

function userLeavingCleanUp(socket) {
    db.one('update player set is_logged_in=$1, socket_id=NULL where socket_id=$2 returning id',
        [false, socket.id])
        .then(success => {
            console.log("on user leaving success: ", success)
        })
        .catch(error => {
            console.log("on user leaving error: ", error)
        });
}

function onNextMove(data, socket) {
    // console.log("next move is: ", data, socket.id);
    if (data.fire_event.hit) {
        db.one('update board_state set hit=TRUE ' +
            'where game_id=$1 ' +
            'AND position_x=$2 ' +
            'AND position_y = $3 ' +
            'AND player_id = $4' +
            'returning *;',
            [data.game_id, data.fire_event.row, data.fire_event.column, data.user.id])
            .then(function (boardState) {
                // io.emit(events.UPDATE_USER_SOCKET, user);
                db.none("UPDATE game SET " +
                    "player1_score = CASE WHEN player1_id=$1 THEN player1_score+10 ELSE player1_score END, " +
                    "player2_score = CASE WHEN player2_id=$1 THEN player2_score+10 ELSE player2_score END " +
                    "WHERE game.id=$2;", [data.user.id, data.game_id])
                    .then(function () {
                        console.log("UPDATE game success: ");
                        updateScore(data.game_id);
                    })
                    .catch(function (error) {
                        console.log("UPDATE game error: ", error);
                    });
            })
            .catch(function (error) {
                console.log("update board_state set hit=TRUE error: ", error);
            });
    }
    else {
        db.none("UPDATE game " +
            "SET player1_turn = CASE WHEN player1_turn=TRUE THEN FALSE ELSE TRUE END " +
            "WHERE game.id=$1;", [data.game_id])
            .then(function () {
                console.log("update board_state set hit=FALSE success: ");
                updateScore(data.game_id)
            })
            .catch(function (error) {
                console.log("update board_state set hit=FALSE error: ", error);
            });

    }
}

const init = (app, server) => {
    io = socketIo(server);

    app.set('io', io);

    io.on('connection', socket => {

        socket.on('disconnect', data => {
            console.log("on user logging out: ", socket.id, this);
            userLeavingCleanUp(socket);
            updateUsers();
        });

        socket.on(events.USER_JOINED, data => {
            db.one('update player set is_logged_in=$1, socket_id=$3 where id=$2 returning *',
                [true, data.id, socket.id])
                .then(function (user) {
                    io.emit(events.UPDATE_USER_SOCKET, user);
                    // io.emit(events.GET_USERS, data);
                    updateUsers();
                });
        });

        socket.on(events.MESSAGE_SEND, data => {
            console.log(data);
            io.emit(events.MESSAGE_SEND, data)
        });


        socket.on(events.CREATE_GAME, function (data) {
            playerCreateNewGame(data, socket)
        });
        socket.on(events.SUBMIT_BOARD, function (data) {
            onSubmitBoard(data, socket)
        });
        socket.on(events.ON_NEXT_MOVE, function (data) {
            onNextMove(data, socket)
        });

        // Player Events
        socket.on(events.PLAYER_JOIN_GAME, function (data) {
            playerJoinGame(data, socket);
        });
    })
};

module.exports = {init};

function playerCreateNewGame(data, socket) {

    console.log("user is creating game! sid: ", socket.id);
    db.one("insert into game(player1_id, socket_created) select id, socket_id from player " +
        "where socket_id=$1 " +
        "returning id, player1_id",
        [socket.id])
        .then(function (data) {
            // console.log(data.id); // print new game id;
            console.log("creating game: " + data.id);

            // Return the Room ID (gameId) and the socket ID (mySocketId) to the browser client
            io.emit(events.CREATE_GAME, {
                gameId: data.id,
                mySocketId: socket.id,
                userCreatedGame: data.player1_id
            });

            console.log("user sid %s created game: %s", socket.id, data.id, socket.rooms);
            socket.join(data.id.toString(), function (err) {
            });

        })
        .catch(function (error) {
            console.log("ERROR:", error.message || error); // print error;
        });
};

function updateScore(gameID) {
    db.one('select *, p1.username as player1_username, p2.username as player2_username ' +
        'FROM game ' +
        'INNER JOIN player AS p1 on p1.id=game.player1_id ' +
        'INNER JOIN player as p2 ON p2.id=game.player2_id ' +
        'WHERE game.id=$1;', [gameID])
        .then(function (row) {
            // console.log("update score success: ", row);
            io.sockets.in(gameID.toString()).emit(events.UPDATE_SCORE, row);
        })
        .catch(function (error) {
            console.log("update score error: ", error);
        })
}
function playerJoinGame(data, socket) {
    console.log('Player ' + data.user.username + 'attempting to join game: ' + data.gameId);
    const room = socket.adapter.rooms[data.gameId.toString()];
    if (room != undefined) {
        data.mySocketId = socket.id;

        // Join the room
        socket.join(data.gameId.toString());

        db.one('update game set player2_id=$1 where id=$2 returning *',
            [data.user.id, data.gameId])
            .then(function (row) {
                console.log("game updated: ", row.id);
                updateScore(data.gameId);
            })
            .catch(function (err) {
                console.log(err);
                // if (err) throw err;
            });
        io.sockets.in(data.gameId.toString()).emit(events.PLAYER_JOINED_GAME, data);
        // io.sockets.in("room").emit(events.PLAYER_JOINED_GAME, data);
        console.log('Player ' + data.user.username + ' joining game: ' + data.gameId);

    } else {
        // Otherwise, send an error message back to the player.
        io.emit('error', {message: "This room does not exist."});
        console.log("This room does not exist. Socket rooms: ", socket.rooms);
        console.log("This room does not exist. IO rooms: ", io.rooms);
    }
}

function onSubmitBoard(boardData, socket) {
    const boardState = boardData.board;
    const user = boardData.user;
    const gameId = boardData.game_id;
    if (!boardState || !user || !gameId)
        res.json({success: false});

    let shipNumber = Object.keys(boardState).length;
    console.log("inserting ships size: ", shipNumber);
    for (let ship in boardState) {
        // console.log(boardState[ship]);
        // console.log("inserting :%s for user %s", ship, user.username);
        db.one("insert into ship(ship_owner, size) values($1, $2) returning id",
            [user.id, boardState[ship].length])
            .then(function (data) {
                // console.log("inserted ship id: " + data.id);

                // more on how to optimize this:
                // http://stackoverflow.com/questions/37300997/multi-row-insert-with-pg-promise
                const cs = new pgp.helpers.ColumnSet(["game_id", "player_id", "ship_id", "position_x", "position_y"],
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
                const query = pgp.helpers.insert(values, cs);

                db.none(query)
                    .then(function () {
                        console.log("inserted player id: %s - game id: %s, shipID: %s",
                            user.id, gameId, data.id);
                        shipNumber--;
                        // console.log(shipNumber);
                        if (shipNumber == 0) {
                            io.sockets.in(boardData.game_id.toString()).emit(
                                events.GET_OPPONENT_BOARD, boardData);
                            console.log("inserted all ships successfully!!!");
                        }
                    })
                    .catch(error => {
                        console.log("board state update ERROR:", error.message || error);
                        shipNumber--;
                        console.log(shipNumber);
                        if (shipNumber == 0)
                            console.log("error", {success: false, message: "error happen"});
                    });
            })
            .catch(function (error) {
                console.log("ships update ERROR:", error.message || error);
            })
    }
}