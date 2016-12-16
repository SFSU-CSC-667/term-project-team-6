/**
 * Created by dusan_cvetkovic on 12/5/16.
 */

import * as battleship from './battleship'
import * as chatClass from './chat'
import * as userClass from './user'
import * as events from './constants/events'

// console.log(LOBBY)

$(document).ready(() => {
    let user;
    let chat;
    const bs = new battleship.Battleship();
    let clientIO;

    $('input#login-submit').click(function (event) {
        event.preventDefault();
        $.post('/login', $('form#login-form').serialize(), function (){}, 'json')
            .done(function (result) {
                clientIO = io();
                user = new userClass.User(result.user, bs, clientIO);
                chat = new chatClass.Chat(user, clientIO);

                $('.page').hide();
                $('#lobby').show();

            })
            .fail(function (error) {
                console.log("error", error)
            })
        ;
    });

    $('button#createGame').click(function (event) {
        "use strict";
        clientIO.emit(events.CREATE_GAME);
    });

    $('#submitBoard').click(function () {
        if (user!== undefined)
            user.submitBoard()
    })
});
