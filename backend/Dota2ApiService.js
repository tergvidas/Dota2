const request = require('request');

function appRequests(app){
    app.get('/MatchList/:id&:from&:to', (req, res) =>{
        let playerId = req.params.id;
        let from = req.params.from;
        let to = req.params.to;

        if (playerId === "z")
            return res.status(500).send({ error: "No SteamID32" });
        
        request('https://api.opendota.com/api/players/'+ playerId + '/matches?offset='+ from +'&limit='+ to, function (error, response, body) {
            if (!error && response.statusCode == 200)
                res.send(body)
            if (response.statusCode == 500)
                res.status(404).send({ error: "No SteamID32" });
        })
    });
}
module.exports = {appRequests};