import * as events from "./constants/events"

let thisUser;
const clientIO = io();

class User {

    constructor(jsonUser, battleship, socket) {
        this.user = jsonUser;
        this.battleship = battleship;
        // this.sock = socket;
        thisUser = this;

        this.bindSocketEvents()   
    }
    
    bindSocketEvents() {
        // this.clientIO.on(events.MESSAGE_SEND, thisChat.onMessageSend);
        // this.clientIO.on(events.GET_USERS, thisChat.onGetUsers);
        // this.clientIO.on(events.CREATE_GAME, thisChat.onGameCreated);
        // this.clientIO.on(events.PLAYER_JOINED_GAME, thisChat.onPlayerJoinedGame);
    }

    // get user(){
    //     return this._user;
    // }


    // get socket(){
    //     return this._socket;
    // }

    submitBoard() {
        $.post('/submit/board',
                {   board: thisUser.battleship.getBoard,
                    user: JSON.stringify(thisUser.user),
                    game_id: thisUser.userGameId},
                function (){},
                'json')
            .done(function (result) {
                console.log("success", result)
            })
            .fail(function (error) {
                console.log("error", error)
            });
    }

    startGame(gameId) {
        $('.page').hide();
        $('#game').show();

        const $pieces = $('.ship');
        this.battleship.bindDragEvents($pieces);
        this.battleship.drawBord("p", 0);
        this.battleship.drawBord("o", 450);

        if (gameId != undefined){
            thisUser.userGameId = gameId;
        }
    }

}

module.exports = {User};