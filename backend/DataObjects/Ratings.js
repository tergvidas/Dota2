let Joi = require('joi');

let rating = {
    ratingId: Joi.number().integer().min(1).required(),
    createDate: Joi.date().min('1-1-2000').max('now').iso().required(),
    modifyDate: Joi.date().min(Joi.ref('createDate')).max('now').iso().required(),
    matchId: Joi.number().integer().min(0).required(),
    rating: Joi.number().integer().min(1).max(10).required(),
    name: Joi.string().min(1).max(100).required(),
    comment: Joi.string().min(1).max(1024).required(),
    anonymous: Joi.boolean().required()
};

module.exports = rating;