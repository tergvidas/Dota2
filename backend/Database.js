const MongoClient = require('mongodb').MongoClient;
const fs = require('fs');
const connectionInfo = JSON.parse(fs.readFileSync(fs.openSync('./backend/DatabaseConfiguration.json', 'r')).toString());
const url = "mongodb://"+connectionInfo.username+":"+connectionInfo.password+"@"+connectionInfo.link;
const dbConnected = MongoClient.connect(url);

let Player = {
    /** 
     * @returns {Promise<Object>} players
    */
    getPlayers: () => {
        return dbConnected.then(db => {
            let myDatabase = db.db('dota2_db')
            return myDatabase.collection("Player").findOne({});
        });
    },

    /** 
     * @param {String} steamId player steamID64
     * @returns {Promise<Object>} player
    */
    getPlayer: (steamID) => {
        return dbConnected.then(db => {
            let myDatabase = db.db('dota2_db')
            return myDatabase.collection("Player").find({playerSteamID64:steamID}, { "_id": 0 }).toArray();
        });
    },

    /** 
     * @param {String} steamID update player steamID64
     * @param {Object} newValues new player info
    */
    updatePlayer: (steamID, newValues) => {
        return dbConnected.then(db => {
            let myDatabase = db.db('dota2_db')
            myDatabase.collection("Player").updateOne({playerSteamID64:steamID}, newValues, function(err, result) {
                if (err){
                    console.log('Error updating: ' + err.message)
                    return;
                }
                console.log('Updated');
            });
        });
    },

    /** 
     * @param {Object} newPlayer new player info
    */
    createPlayer: (newPlayer) => {
        return dbConnected.then(db => {
            let myDatabase = db.db('dota2_db')
            myDatabase.collection("Player").insertOne(newPlayer, function(err, result) {
                if (err) {
                    console.log('Error ' + err.message)
                    return;
                }
                console.log('Created');
            });
        });
    },
    /** 
     * @param {String} steamID update player steamID64
    */
    deletePlayer: (steamID) => {
        return dbConnected.then(db => {
            let myDatabase = db.db('dota2_db')
            myDatabase.collection("Player").deleteOne({playerSteamID64:steamID}, function(err, result) {
                if (err){
                    console.log('Error deleting: ' + err.message)
                    return;
                }
                console.log('Deleted');
            });
        });
    }
}
 
let Matches = {
    /** 
     * @returns {Promise<Object>} matches
    */
    getMatches: () => {
        return dbConnected.then(db => {
            let myDatabase = db.db('dota2_db')
            return myDatabase.collection("Matches").findOne({});
        });
    },

    /** 
     * @param {number} matchID
     * @returns {Promise<Object>} match
    */
    getMatch: (matchID) => {
        return dbConnected.then(db => {
            let myDatabase = db.db('dota2_db')
            return myDatabase.collection("Matches").find({id:matchID}, { "_id": 0 }).toArray();
        });
    },

    /** 
     * @param {number} matchID
     * @param {Object} newValues new match value
    */
    updateMatch: (matchID, newValues) => {
        return dbConnected.then(db => {
            let myDatabase = db.db('dota2_db')
            myDatabase.collection("Matches").updateOne({id: matchID}, newValues, function(err, result) {
                if (err){
                    console.log('Error updating: ' + err.message)
                    return;
                }
                console.log('Updated');
            });
        });
    },
    /** 
     * @param {Object} newMatch new match info
    */
    createMatch: (newMatch) => {
        return dbConnected.then(db => {
            let myDatabase = db.db('dota2_db')
            myDatabase.collection("Matches").insertOne(newMatch, function(err, result) {
                if (err) {
                    console.log('Error ' + err.message)
                }
                console.log('Created');
            });
        });
    },

    /** 
     * @param {number} matchID
    */
    deleteMatch: (matchID) => {
        return dbConnected.then(db => {
            let myDatabase = db.db('dota2_db')
            myDatabase.collection("Matches").deleteOne({id:matchID}, function(err, result) {
                if (err){
                    console.log('Error deleting: ' + err.message)
                }
                console.log('Deleted');
            });
        });
    }
}

module.exports = {Player, Matches}; 