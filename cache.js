const redis = require('redis');
const { promisify } = require('util');

const client = redis.createClient();

client.on('connect', function() {
    console.log('You are now connected to Redis Client');
});

const getAsync = promisify(client.get).bind(client);

const getHashAsync = promisify(client.hmget).bind(client);

const getAllHashAsync = promisify(client.hgetall).bind(client);

exports.addToCache = (key, value, exp) => {
    if (exp) {
        client.setex(key, exp, value);
    } else {
        client.set(key, value);
    }
}

exports.getFromCache = (key) => getAsync(key);

exports.addToHash = (key, values) => {
    client.hmset(key, values);
}

exports.getFromHash = (key, params) => {
    if (params) {
        return getHashAsync(key, params);
    } else {
        return getAllHashAsync(key);
    }
}

