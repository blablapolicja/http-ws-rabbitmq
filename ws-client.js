'use strict';

const cluster = require('cluster');
const WebSocket = require('ws');

const MAX_MESSAGES = 3000;
const message = JSON.stringify({
    firstName: 'Mark',
    lastName: 'Unknown',
    message: 'Hi',
    birth: '10.10.1993',
    hobbies: ['movies', 'doing nothing', 'origami'],
});

if (cluster.isMaster) {
    console.log(`Master ${process.pid} is running`);

    for (let i = 1; i <= 4; i++) {
        cluster.fork();
    }
} else {
    console.log(`Worker ${process.pid} started`);

    const ws = new WebSocket('ws://localhost:8080');

    const send = (message) => {
        return new Promise((resolve) => {
            ws.send(message, () => resolve());
        });
    }

    ws.on('open', async () => {
        console.time('ws');

        for (let index = 1; index <= MAX_MESSAGES; index++) {
            await send(message);
        }

        console.timeEnd('ws');
        ws.close();
        process.exit();
    });
}
