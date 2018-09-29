'use strict';

const amqp = require('amqplib');

const MAX_MESSAGES = 3000 * 4;
const queueName = 'main';
let count = 0;

const start = async () => {
    const connection = await amqp.connect('amqp://localhost');
    const channel = await connection.createChannel();

    await channel.assertQueue(queueName);

    channel.consume(
        queueName,
        (message) => {
            if (!message) {
                return;
            }

            channel.ack(message);

            if (count === 0) {
                console.time('amqp');
            }

            count++;

            if (count === MAX_MESSAGES) {
                setImmediate(() => {
                    console.timeEnd('amqp');
                    console.log(count);
                });
            }
        },
        {
            // noAck: true,
            durable: true,
        }
    );
};

start();
