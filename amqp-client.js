'use strict';

const cluster = require('cluster');
const amqp = require('amqplib');

const MAX_MESSAGES = 3000;
const message = JSON.stringify({
    firstName: 'Mark',
    lastName: 'Unknown',
    message: 'Hi',
    birth: '10.10.1993',
    hobbies: ['movies', 'doing nothing', 'origami'],
});
const queueName = 'main';

const start = async () => {
    const connection = await amqp.connect('amqp://localhost');
    const channel = await connection.createChannel();
    let index;

    await channel.assertQueue(queueName);

    for (index = 1; index <= MAX_MESSAGES; index++) {
        channel.sendToQueue(queueName, Buffer.from(message));
    }
};

if (cluster.isMaster) {
    console.log(`Master ${process.pid} started`);

    for (let index = 1; index <= 4; index++) {
        cluster.fork();
    }
} else {
    console.log(`Worker ${process.pid} started`);

    start();
}
