/**
 * Created by dusan_cvetkovic on 11/1/16.
 */

var socket = io();
$('form').submit(function () {
    socket.emit('chat message', $('#m').val());
    $('#m').val('');
    return false;
});
socket.on('chat message', function (msg) {
    $('#messages').append($('<li>').text(msg));
});
