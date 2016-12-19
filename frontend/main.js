/**
 * Created by dusan_cvetkovic on 12/5/16.
 */


import * as chatClass from './chat'
import * as userClass from './user'
import * as events from './constants/events'

// console.log(LOBBY)
let user;
let chat;
// const bs = new battleship.Battleship();
let clientIO;


function bindSocketEvents() {

}

$(document).ready(() => {

    $('input#login-submit').click(function (event) {
        event.preventDefault();
        $.post('/login', $('form#login-form').serialize(), function () {
        }, 'json')
            .done(function (result) {
                if (!result.success){
                    console.log("login res ",result);
                    return;
                }
                clientIO = io();
                // bindSocketEvents();
                user = new userClass.User(result.user);
                chat = new chatClass.Chat(user, clientIO);

                $('.page').hide();
                $('#lobby').show();
                populateHeader(user.user);

            })
            .fail(function (error) {
                console.log("error", error)
            })
        ;
    });

    $('button#createGame').click(function (event) {
        "use strict";
        clientIO.emit(events.CREATE_GAME, {user: user.user});
    });
});

function populateHeader(user) {
    $('#header').show();
    $('#header #user').html("Welcome " + user.username);
}
