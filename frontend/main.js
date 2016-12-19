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

function showErrorMessage(error) {
    $('#login-error').text(error.message);
    $('#login-error').show();
    console.log("error", error);
    alertify.notify(error.message, 'error');
}
$(document).ready(() => {

    function populateHeader(user) {
        $('#header').show();
        $('#header #user').html("Welcome " + user.username);
    }

    function login(result) {
        if (!result.success) {
            showErrorMessage(result);
            return;
        }
        clientIO = io();
        user = new userClass.User(result.user);
        chat = new chatClass.Chat(user, clientIO);

        $('.page').hide();
        $('#lobby').show();
        populateHeader(user.user);
    }

    $('.login-tab').click(function (event) {
        $('#register-error').hide();
        $('#login-error').hide();
    });

    $('input#login-submit').click(function (event) {
        event.preventDefault();
        $.post('/login', $('form#login-form').serialize(), function () {
        }, 'json')
            .done(function (result) {
                login(result);
            })
            .fail(function (error) {
                showErrorMessage(JSON.parse(error.responseText));
            })
        ;
    });

    $('input#register-submit').click(function (event) {
        event.preventDefault();
        $.post('/register', $('form#register-form').serialize(), function () {
        }, 'json')
            .done(function (result) {
                login(result);
            })
            .fail(function (error) {
                $('#register-error').text("Error registering");
                $('#register-error').show();
                console.log("error", error);
            });
    });

    $('button#createGame').click(function (event) {
        "use strict";
        clientIO.emit(events.CREATE_GAME, {user: user.user});
    });
});