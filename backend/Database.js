const MongoClient = require('mongodb').MongoClient;
//const url =   
const dbConnected = MongoClient.connect(url);

let Player = {
    /** 
     * @returns {Object} players
    */
    getPlayers: () => {
        return dbConnected.then(db => {
            let myDatabase = db.db('dota2_db')
            myDatabase.collection("Player").findOne({}, function(err, result) {
                if (err){
                    console.log('Error getting players: ' + err.message)
                    return;
                }
                return result;
              });
        });
    },

    /** 
     * @param {String} steamId player steamID64
     * @returns {Object} player
    */
    getPlayer: (steamID) => {
        return dbConnected.then(db => {
            let myDatabase = db.db('dota2_db')
            myDatabase.collection("Player").find({playerSteamID64:steamID}, { "_id": 0 }).toArray(function(err, result) {
                if (err){
                    console.log('Error getting player: ' + err.message)
                    return;
                }
                return result;
              });
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
     * @returns {Object} matches
    */
    getMatches: () => {
        return dbConnected.then(db => {
            let myDatabase = db.db('dota2_db')
            myDatabase.collection("Matches").findOne({}, function(err, result) {
                if (err){
                    console.log('Error getting matches: ' + err.message)
                    return;
                }
                return result;
              });
        });
    },

    /** 
     * @param {number} matchID
     * @returns {Object} match
    */
    getMatch: (matchID) => {
        return dbConnected.then(db => {
            let myDatabase = db.db('dota2_db')
            myDatabase.collection("Matches").find({id:matchID}, { "_id": 0 }).toArray(function(err, result) {
                if (err){
                    console.log('Error getting match: ' + err.message)
                    return;
                }
                return result;
              });
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