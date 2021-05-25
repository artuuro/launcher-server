const jwt = require('njwt');

const { secret, algorhytm } = {
    secret: `12334`, // api should issue an JWT with this same token
    expiresIn: false,
    algorhytm: 'HS256',
};

const err = e => {
    throw e.userMessage.replace(' ', '_').toLowerCase();
};

const create = (data, days = 9999) => {
    try {
        const token = jwt.create(data, secret, algorhytm);

        token.setExpiration(new Date().getTime() + (3600 * 1000 * 24 * days));

        return token.compact();
    } catch (e) {
        err(e);
    }
};

const read = token => {
    try {
        const result = jwt.verify(token, secret, algorhytm);
        return result;
    } catch (e) {
        console.log(e);
        throw new Error(e)
    }
};

module.exports = {
    read,
    create,
};