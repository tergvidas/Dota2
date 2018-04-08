let Joi = require('joi');

let match = {
    id: Joi.number().integer().min(0).required(),
    createDate: Joi.date().min('9-7-2013').max('1-1-3000').iso().required(),
    modifyDate: Joi.date().min(Joi.ref('createDate')).max('now').iso().required(),
    status: Joi.string().regex(/(Playing)|(Ended)|(Waiting)/).required(),
    duration: Joi.number().integer().min(0).required(),
    radiant_win: Joi.boolean(),
    radiant_score: Joi.number().integer().min(0).required(),
    radiant_team: Joi.array(player).required(),
    dire_score: Joi.number().integer().min(0).required(),
    dire_team: Joi.array(player).required(),
};

module.exports = match;