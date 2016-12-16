const socketIo = require('socket.io');
const events = require('../frontend/constants/events');
let io, socket;
const db = require('../bin/db/db').battleshipDB;


const connections = [];
const users = {};

function updateUsers() {
    const usersList = [];
    for (let user in users)
        usersList.push(users[user]);
    console.log(usersList);
    io.emit(events.GET_USERS, usersList)
}

const init = (app, server) => {
    io = socketIo(server);

    app.set('io', io);

    io.on('connection', socketParam => {
        connections.push(socketParam);
        console.log('user connected. %s connections', connections.length);

        socket = socketParam;
        socket.on('disconnect', data => {
            connections.splice(connections.indexOf(this), 1);
            delete users[socket.id];
            updateUsers();
            console.log('user disconnected. %s connections %s users',
                connections.length,
                users.size
            );
        });

        socket.on(events.USER_JOINED, data => {
            users[socket.id] = data.user;
            console.log(users);

            io.emit(events.USER_JOINED, data);

            updateUsers();
        });

        socket.on(events.MESSAGE_SEND, data => {
            console.log(data);
            io.emit(events.MESSAGE_SEND, data)
        });


        socket.on(events.CREATE_GAME, hostCreateNewGame);
        // socket.on(events.GAME_START, hostPrepareGame);
        // socket.on(events.COUNTDOWN, hostStartGame);
        // socket.on(events.NEXT_MOVE, hostNextRound);

        // Player Events
        socket.on(events.PLAYER_JOIN_GAME, playerJoinGame);
        // socket.on(events.PLAYER_MOVE, playerAnswer);
        // socket.on(events.PLAYER_RESTART, playerRestart);
    })
};

module.exports = {init};

function hostCreateNewGame() {

    const user = users[this.id];
    console.log("user is creating game!", user);
    db.one("insert into game(player1_id) values($1) returning id", [user.id])
        .then(function (data) {
            // console.log(data.id); // print new game id;
            console.log("creating game: " + data.id);

            // Return the Room ID (gameId) and the socket ID (mySocketId) to the browser client
            io.emit(events.CREATE_GAME, {
                gameId: data.id,
                mySocketId: socket.id,
                userCreatedGame: user
            });

            socket.join(data.id.toString());
            // socket.join("room");
            console.log("user %s created game: %s", user.username, data.id)

        })
        .catch(function (error) {
            console.log("ERROR:", error.message || error); // print error;
        });

    // const thisGameId = ( Math.random() * 100000 ) | 0;
    // Create a unique Socket.IO Room

};

function playerJoinGame(data) {
    console.log('Player ' + data.user.username + 'attempting to join game: ' + data.gameId);

    var room = socket.rooms[data.gameId.toString()];
    // var room = socket.rooms["room"];

    // If the room exists...
    if (room != undefined) {
        // attach the socket id to the data object.
        data.mySocketId = socket.id;

        // Join the room
        this.join(data.gameId.toString());
        // this.join("room");

        db.one("SELECT * FROM player WHERE id=$1", [data.user.id])
            .then(function (row) {
                if (typeof row == "undefined") {

                } else {
                    console.log("row is: ", row);
                }
            })
            .catch(function (err) {
                console.log(err);
                if (err) throw err;
            });
        io.sockets.in(data.gameId.toString()).emit(events.PLAYER_JOINED_GAME, data);
        // io.sockets.in("room").emit(events.PLAYER_JOINED_GAME, data);
        console.log('Player ' + data.user.username + ' joining game: ' + data.gameId);

    } else {
        // Otherwise, send an error message back to the player.
        this.emit('error', {message: "This room does not exist."});
    }
}