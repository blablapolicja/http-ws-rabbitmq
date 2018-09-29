'use strict';

const WebSocket = require('ws');

const MAX_MESSAGES = 3000 * 4;

const server = new WebSocket.Server({ port: 8080 });
let count = 0;

server.on('connection', (ws) => {
    ws.on('message', (message) => {
        count++;

        if (count === MAX_MESSAGES) {
            server.close();
        }
    });
});
