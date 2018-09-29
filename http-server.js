'use strict';

const http = require('http');

const handler = (req, res) => {
    res.end();
};

const server = http.createServer(handler);

server.listen(3000);
