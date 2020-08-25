const cache = require('../cache');

exports.getUserDetails = async (req, res, next) => {
    const {username} = req.params;

    if (!username){
        res.send('please type username');
    }

    if (req.query.field) {
        return  next();
    }

    const data = await cache.getFromCache(username);

    if (data) {
        res.json(data);
    } else {
    next()
    }
}

exports.getUserDetailsFromHash = async (req, res, next) => {
    const {username} = req.params;
    const {field} = req.query;

    if (!field) {
       return  next();
    }

    const data = await cache.getFromHash(`${username}fields`, field);
    if (!data.includes(null)) {
        res.json(data);
    } else {
        next()
    }
}