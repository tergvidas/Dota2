let Joi = require('joi');

let player = {
    id: Joi.number().integer().min(0).required(),
    createDate: Joi.date().min('1-1-2000').max('now').iso().required(),
    modifyDate: Joi.date().min(Joi.ref('createDate')).max('now').iso().required(),
    playerName: Joi.string().min(1).max(100).required(),
    playerSteamID64: Joi.number().integer().min(10000000000000000).max(99999999999999999).required(),
    playerAvatar: Joi.string().min(1).max(256)
};

module.exports = player;