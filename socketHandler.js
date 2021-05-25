const { Socket } = require('net');
const { read } = require('./jwt');

const remote = {
    host: '148.251.195.215',
    port: 1453,
};

module.exports = local => {
    const proxy = new Socket();
    let session = false;

    const disconnect = () => {
        proxy.destroy();
        local.destroy();
    };

    proxy.connect({
        host: remote.host,
        port: remote.port,
        onread: {
            buffer: Buffer.alloc(8192),
        },
    });

    console.log(`Connected ${JSON.stringify(remote)}`);

    local.on('data', data => {
        const { c: category, d: payload } = JSON.parse(Buffer.from(data).toString());

        switch (category) {
            case 0:
                if (!session) {
                    session = read(payload);
                    if (!session) disconnect();
                } else disconnect();
            break;
            case 1:
                if (session) {
                    proxy.write(Buffer.from(payload));
                } else disconnect();
            break;
            default:
                disconnect();
            break;
        }
    });

    proxy.on('data', data => local.write(data));

    local.on('error', () => proxy.destroy());
    proxy.on('error', () => local.destroy());
};