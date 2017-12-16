/**
 * Socket.io configuration
 */
'use strict';

import config from './environment';

// When the user disconnects.. perform this
function onDisconnect(socket) {
    console.log('Client disconected');
}

// When the user connects.. perform this
function onConnect(socket, io) {
    // When the client emits 'info', this listens and executes
    socket.on('info', data => {
        socket.log(JSON.stringify(data, null, 2));
    });

    // Insert sockets below
    require('../api/donation/donation.socket').register(socket, io);
}

export default function (socketio) {
    socketio.on('connection', function (socket) {
        socket.address = `${socket.request.connection.remoteAddress}:${socket.request.connection.remotePort}`;

        socket.connectedAt = new Date();

        socket.log = function (...data) {
            console.log(`SocketIO ${socket.nsp.name} [${socket.address}]`, ...data);
        };

        // Call onDisconnect.
        socket.on('disconnect', () => {
            onDisconnect(socket);
            socket.log('DISCONNECTED');
        });

        // Call onConnect.
        onConnect(socket, socketio);
        socket.log('CONNECTED');
    });
}
