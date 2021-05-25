const { createServer } = require('net');
const socketHandler = require('./socketHandler');

const server = createServer(socketHandler);

const run = () => {
    server.listen(14300, '0.0.0.0');
    console.log(`Decoder Ready`);
};

run();