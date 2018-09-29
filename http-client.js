'use strict';

const cluster = require('cluster');
const http = require('http');

const MAX_MESSAGES = 3000;
const options = {
    hostname: 'localhost',
    port: 3000,
    method: 'POST',
};
const message = JSON.stringify({
    firstName: 'Mark',
    lastName: 'Unknown',
    message: 'Hi',
    birth: '10.10.1993',
    hobbies: ['movies', 'doing nothing', 'origami'],
});

const request = () => {
    return new Promise((resolve, reject) => {
        const req = http.request(options, (res) => {
            let rawData = '';

            res.setEncoding('utf8');

            res.on('data', (chunk) => {
                rawData += chunk;
            });

            res.on('end', () => resolve());
        });

        req.on('error', error => reject(error));

        req.write(message);
        req.end();
    });
};

const start = async () => {
    console.time('http');

    for (let index = 1; index <= MAX_MESSAGES; index++) {
        await request();
    }

    console.timeEnd('http');
    process.exit();
};

if (cluster.isMaster) {
    console.log(`Master ${process.pid} is running`);

    for (let i = 1; i <= 4; i++) {
        cluster.fork();
    }
} else {
    console.log(`Worker ${process.pid} started`);

    start();
}
