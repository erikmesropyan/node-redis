const express = require('express');
const fetch = require('node-fetch');

const cacheController = require('./middleware/cacheController');
const cache = require('./cache');

const router = express.Router();

router.get('/user/:username',
    cacheController.getUserDetails,
    cacheController.getUserDetailsFromHash,
    async (req, res) => {
        const {username} = req.params;
        const {field} = req.query;

        const response = await fetch(`https://api.github.com/users/${username}`);

        const data = await response.json();

        cache.addToCache(username, JSON.stringify(data), 3600);
        let convertedData;
        convertedData = Object.entries(data).reduce((array, [k, v]) => {
            if (!v) {
                if (v === 0) {
                    v = '0'
                } else {
                    v = ''
                }
            }
            array.push(k, v);
            return array;
        }, []);
        cache.addToHash(`${username}fields`, convertedData)
        if (field) {
            let responseData = [];
            if (typeof field === "string") {
                responseData.push(data[field]);
            } else {
                field.forEach(key => {
                    responseData.push(data[key]);
                })
            }
            res.json(responseData);
        } else {
            res.json(data);
        }
    })


module.exports = router;