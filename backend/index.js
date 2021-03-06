const path = require('path');
const express = require('express');
const webpack = require('webpack');
const webpackMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');
const config = require('./../webpack.config.js');

const isDeveloping = process.env.NODE_ENV !== 'production';
const port = isDeveloping ? 3000 : process.env.PORT;
const app = express();

const Dota2ApiService = require('./Dota2ApiService');
const RatingsAppService = require('./RatingsAppService');
const dataBase = require('./DataBase');
dataBase.MatchRating.connect();
bodyParser = require('body-parser');

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

app.use(bodyParser.json());

Dota2ApiService.appRequests(app);
RatingsAppService.appRequests(app);

app.listen(port, error => {
    if (error) {
        return console.error(error);
    }
    console.info('==> 🌎 Listening on port %s. Open up http://localhost:%s/ in your browser.', port, port);
});