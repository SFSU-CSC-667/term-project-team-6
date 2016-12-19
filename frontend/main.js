/**
 * Created by dusan_cvetkovic on 12/5/16.
 */

import * as battleship from './battleship'
import * as chatClass from './chat'
import * as userClass from './user'
import * as events from './constants/events'

// console.log(LOBBY)
let user;
let chat;
const bs = new battleship.Battleship();
let clientIO;

function onOpponentBoardSubmit(boardData) {
    if (boardData.user.id != user.user.id){
        bs.setOpponentBoard(boardData.board);
    }
}
function bindSocketEvents() {
    clientIO.on(events.GET_OPPONENT_BOARD, onOpponentBoardSubmit);
}

$(document).ready(() => {

    function populateHeader(user) {
        $('#header').show();
        $('#header #user').html("Welcome " + user.username);
    }

    $('input#login-submit').click(function (event) {
        event.preventDefault();
        $.post('/login', $('form#login-form').serialize(), function () {
        }, 'json')
            .done(function (result) {
                //TODO call method login();
                clientIO = io();
                bindSocketEvents();
                user = new userClass.User(result.user, bs, clientIO);
                chat = new chatClass.Chat(user, clientIO);

                $('.page').hide();
                $('#lobby').show();
                populateHeader(user.user);
            })
            .fail(function (error) {
                //TODO update UI
                console.log("error", error)
            })
        ;
    });

    $('input#register-submit').click( function (event) {
        event.preventDefault();
        $.post('/register', $('form#register-form').serialize(), function () {

        }, 'json')
            .done( function(result) {
                //TODO call method login()
            })
        .fail( function (error) {
           //TODO update UI
        });
    });

    $('button#createGame').click(function (event) {
        "use strict";
        clientIO.emit(events.CREATE_GAME, {user: user.user});
    });

    $('#submitBoard').click(function () {
        if (user !== undefined) {
            clientIO.emit(events.SUBMIT_BOARD, user.getBoardData());

        }
        // user.submitBoard()
    })
});
