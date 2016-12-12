/**
 * Created by dusan_cvetkovic on 11/1/16.
 */
import * as events from "./constants/events"

let thisChat;

class Chat {
    constructor(user, socket) {
        thisChat = this;
        this.user = user;
        this.userSocket = socket;
        this.$usersList = $('#connections');

        this.bindEvents();
        this.bindSocketEvents();

        this.userSocket.emit(events.USER_JOINED, thisChat.user);
    }

    bindSocketEvents() {
        this.userSocket.on(events.MESSAGE_SEND, thisChat.onMessageSend);
        this.userSocket.on(events.GET_USERS, thisChat.onGetUsers);
        this.userSocket.on(events.CREATE_GAME, thisChat.onGameCreated);
        this.userSocket.on(events.PLAYER_JOINED_GAME, thisChat.onPlayerJoinedGame);
    }

    onPlayerJoinedGame(data) {
        if (data.user.id === thisChat.user.user.id) {
            thisChat.user.startGame();
        }
        console.log("logged to game: ", data);
    }

    bindEvents() {

        $('form#chat-form').submit(this.onMessageSubmit);
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
        let $userNameItems = "";
        for (let i = 0; i < data.length; i++) {
            $userNameItems +=
                '<li class="list-group-item user" ' +
                'id="' + data[i].id + '">' + data[i].username + '</li>';
        }
        // this.$usersList.appendChild($userNameItems);
        thisChat.$usersList.html($userNameItems);

    }

    onGameCreated(data) {
        const user = data.userCreatedGame;
        const joinButton = $('<button />')
            .addClass('btn-join')
            .addClass('btn-sm')
            .addClass('btn-primary')
            .addClass('pull-right')
            .attr("id", user.id)
            .text('Join Game');

        if ($('#connections .btn-join #' + user.id).length==0) {
            $('#connections li#' + user.id).append(joinButton);
            joinButton.on('click', function () {
                thisChat.onJoinGame(data.gameId);
            });
        }

        if (this.id === data.mySocketId) {
            thisChat.user.startGame();
        }
    }

    onJoinGame(gameId) {
        this.userSocket.emit(events.PLAYER_JOIN_GAME, {
            gameId: gameId,
            user: this.user.user,
            mySocketId: this.userSocket.id
        });
    }


}

module.exports = {Chat};



