/**
 * Created by dusan_cvetkovic on 11/1/16.
 */
import * as events from "./constants/events"

let thisChat;

class Chat {
    constructor(user, socket) {
        thisChat = this;
        this.user = user.user;
        this.userObj = user;
        this.userSocket = socket;
        this.$usersList = $('#connections');
        this.$opponentScore = $('#header #opponent');
        this.$userScore = $('#header #user');

        this.bindEvents();
        this.bindSocketEvents();

        this.userSocket.emit(events.USER_JOINED, thisChat.user);
    }

    bindSocketEvents() {
        this.userSocket.on(events.MESSAGE_SEND, thisChat.onMessageSend);
        this.userSocket.on(events.GET_USERS, thisChat.onGetUsers);
        this.userSocket.on(events.CREATE_GAME, thisChat.onGameCreated);
        this.userSocket.on(events.PLAYER_JOINED_GAME, thisChat.onPlayerJoinedGame);
        this.userSocket.on(events.UPDATE_USER_SOCKET, thisChat.onUpdateUserSocket);
        this.userSocket.on(events.UPDATE_SCORE, thisChat.onUpdateScore);
    }

    onUpdateScore(gameData) {
        console.log(gameData);
        if (thisChat.user.id == gameData.player1_id) {
            thisChat.$userScore.html("User: " + gameData.player1_username +
                ": " + gameData.player1_score);
            thisChat.$opponentScore.html("Opp: " + gameData.player2_username +
                ": " + gameData.player2_score);
        }
        else {
            thisChat.$userScore.html("User: " + gameData.player2_username +
                ": " + gameData.player2_score);
            thisChat.$opponentScore.html("Opponent: " + gameData.player1_username +
                ": " + gameData.player1_score);
        }

        if ( (thisChat.user.id == gameData.player1_id && gameData.player1_turn) ||
            (thisChat.user.id == gameData.player2_id && !gameData.player1_turn)
        ){
            $('#opponent_board').removeClass('disabled-button');
        }
        else{
            $('#opponent_board').addClass('disabled-button');
        }

        thisChat.$opponentScore.show();
    }

    onUpdateUserSocket(data) {
        console.log(data);
        if (data.id == thisChat.user.id) {
            thisChat.userObj.user = data;
            thisChat.user = thisChat.userObj.user;
        }
    }

    onPlayerJoinedGame(data) {
        if (data.user.id === thisChat.user.id) {
            thisChat.userObj.startGame(data.gameId);
            thisChat.$userScore.html("User: " + data.user.username);
        }
        else {
            thisChat.$opponentScore.html("Opponent: " + data.user.username);
            thisChat.$opponentScore.show();
        }
        console.log("logged to game: ", data);
        $('#game-area').show();
        $('#wait-opponent').hide();
        // $('#wait-opponent').removeClass('loader');


    }

    bindEvents() {

        $('form#chat-form').submit(function (event) {
            event.preventDefault();
            thisChat.onMessageSubmit();
        });
    }

    onMessageSend(msg) {
        $('#messages').append($('<li>').addClass("well").text(msg));
        console.log("message received ", msg)
    }

    onMessageSubmit() {
        this.userSocket.emit(events.MESSAGE_SEND, $('#m').val());
        $('#m').val('');
        console.log("message sent ", $('#m').val());
        return false;
    }

    onGetUsers(data) {
        // let $userNameItems = "";
        thisChat.$usersList.html("");
        const usersList = data.usersList;
        usersList.forEach(function (user) {
            const $userNameItem = $('<li/>')
                .addClass("list-group-item")
                .addClass("user")
                .attr("id", user.id)
                .html(user.username);
            data.games.some(function (game) {
                if (user.socket_id == game.socket_created) {
                    const joinButton = thisChat.buildJoinButton(user.id);
                    joinButton.on('click', function () {
                        thisChat.onJoinGame(game.id);
                    });
                    $userNameItem.append(joinButton);
                    return true;
                }
            });
            thisChat.$usersList.append($userNameItem);
        });

        // this.$usersList.appendChild($userNameItems);


    }

    onGameCreated(data) {
        const userID = data.userCreatedGame;
        const joinButton = thisChat.buildJoinButton(userID);

        if ($('#connections .btn-join #' + userID).length == 0) {
            $('#connections li#' + userID).append(joinButton);
            joinButton.on('click', function () {
                thisChat.onJoinGame(data.gameId);
            });
        }

        if (this.id === data.mySocketId) {
            thisChat.userObj.startGame(data.gameId);
        }
    }

    buildJoinButton(userID) {
        return $('<button />')
            .addClass('btn-join')
            .addClass('btn-sm')
            .addClass('btn-primary')
            .addClass('pull-right')
            .attr("id", userID)
            .text('Join Game');
    }

    onJoinGame(gameId) {
        this.userSocket.emit(events.PLAYER_JOIN_GAME, {
            gameId: gameId,
            user: this.user,
            mySocketId: this.userSocket.id
        });
    }


}

module.exports = {Chat};



