const { createServer } = require('http');
const app = require('../server');

const server = createServer(app);

module.exports = (req, res) => {
    server.emit('request', req, res);
};

