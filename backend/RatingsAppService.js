const Joi = require('joi');
const database = require('./DataBase');

const Ratings = require('./DataObjects/Ratings');

function appRequests(app){
    app.get('/MatchRating/:id', (req, res) =>{
        let ratingID = req.params.id;
        database.MatchRating.getRating(ratingID.toString())
            .then(data => {
                res.send(data)
            });
    });
    
    app.get('/MatchRatings/:filter&:from&:to&:anonymous&:showItems&:both', (req, res) =>{
        let options = {
            filter: req.params.filter,
            from: req.params.from,
            to: req.params.to,
            anonymous: req.params.anonymous,
            both: req.params.both,
            showItems: req.params.showItems
        }
        database.MatchRating.getRatings(options)
            .then(data => {
            res.send(data)});
    });

    app.delete('/MatchRating/:id', (req, res) =>{
        let ratingID = req.params.id;
        res.send(database.MatchRating.deleteRating(ratingID.toString()));
    });

    app.put('/MatchRating', (req, res) =>{
        let newRating = req.body;
        res.send(database.MatchRating.updateRating(newRating));
    });

    app.post('/MatchRating', (req, res) =>{
        let newRating = req.body;
        newRating.ratingId = 4;
        delete newRating['_id'];
        res.send(database.MatchRating.createRating(newRating));
    });
}
module.exports = {appRequests};