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
    app.get('/MatchRatings', (req, res) =>{
        database.MatchRating.getRatings()
            .then(data => {
        res.send(data)});
    });
    /*app.delete('/MatchRating/:id', (req, res) =>{
        let playerID = req.params.id;
        //res.send(database.Player.deletePlayer(playerID.toString()));
    });*/
    app.put('/MatchRating', (req, res) =>{
    });
}
module.exports = {appRequests};