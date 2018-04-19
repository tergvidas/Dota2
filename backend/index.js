const path = require('path');
const express = require('express');
const webpack = require('webpack');
const webpackMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');
const config = require('./../webpack.config.js');

const isDeveloping = process.env.NODE_ENV !== 'production';
const port = isDeveloping ? 3000 : process.env.PORT;
const app = express();
const database = require('./Database');

if (isDeveloping) {
    const compiler = webpack(config);
    const middleware = webpackMiddleware(compiler, {
        publicPath: config.output.publicPath,
        contentBase: path.join('frontend', 'src'),
        stats: {
            colors: true,
            hash: false,
            timings: true,
            chunks: false,
            chunkModules: false,
            modules: false
        }
    });
    
    app.use(middleware);
    app.use(webpackHotMiddleware(compiler));
    app.get('/', function response(req, res) {
        res.write(middleware.fileSystem.readFileSync(path.join(__dirname, '..', 'frontend', 'dist', 'index.html')));
        res.end();
    });
    
} else {
    app.use(express.static(__dirname + './frontend/dist'));
    app.get('/', function response(req, res) {
        res.sendFile(path.join(__dirname, 'frontend', 'dist', 'index.html'));
    });
}

appRequests(app);
app.listen(port, error => {
    if (error) {
        return console.error(error);
    }
    console.info('==> 🌎 Listening on port %s. Open up http://localhost:%s/ in your browser.', port, port);
});

function appRequests(app){
    app.get('/player/:id', (req, res) =>{
        let playerID = req.params.id;
        database.Player.getPlayer(playerID.toString())
            .then(data => {
                res.send(data)
            });
    });
    app.get('/players', (req, res) =>{
        database.Player.getPlayers()
            .then(data => {
        res.send(data)});
    });
    /*app.delete('/player/:id', (req, res) =>{
        let playerID = req.params.id;
        //res.send(database.Player.deletePlayer(playerID.toString()));
    });*/
    app.put('/players', (req, res) =>{
        


    });


    app.get('/matches', (req, res) =>{
        database.Matches.getMatches()
            .then(data => {
        res.send(data)});
    });
    app.get('/match/:id', (req, res) =>{
        matchID = req.params.id;
        database.Player.getPlayer(matchID)
            .then(data => {
                res.send(data)
            });
    });
    /*app.delete('/match/:id', (req, res) =>{
        matchID = req.params.id;
        //res.send(database.Matches.deleteMatch(matchID));
    });*/
    app.put('/match', (req, res) =>{
        

    });
}