const MongoClient = require('mongodb');
const fs = require('fs');
const connectionInfo = JSON.parse(fs.readFileSync(fs.openSync('./backend/DatabaseConfiguration.json', 'r')).toString());
const url = "mongodb://"+connectionInfo.username+":"+connectionInfo.password+"@"+connectionInfo.link;

const RatingObject = require("./DataObjects/Ratings");
let myDatabase = null;

let MatchRating = {
    connect: () => {
        MongoClient.connect(url, (error, client) => {               
            if(error){
            console.error(error);
            return;
            }
            myDatabase = client.db('dota2_db'); 
        });  
    },
    /** 
     * @param {Object} options filter options
     * @returns {Promise<Array<RatingObject>>} matches
    */
    getRatings: (option) => {
            let query;
            query = [{}];
            console.log(JSON.stringify(query))
            return myDatabase.collection("MatchRating").find({$and: query}).toArray();
    },

    /** 
     * @param {number} ratingID
     * @returns {Promise<RatingObject>} 
    */
   getRating: (ratingID) => {
            return myDatabase.collection("MatchRating").find({ratingId:parseInt(ratingID)}).toArray();
    },

    /** 
     * @param {number} ratingID
     * @param {RatingObject} newValues
    */
    updateRating: (ratingID, newValues) => {
            myDatabase.collection("MatchRating").updateOne({ratingId: ratingID}, newValues, function(err, result) {
                if (err){
                    console.log('Error updating: ' + err.message)
                    return;
                }
                console.log('Updated');
            });
    },
    /** 
     * @param {RatingObject} newRating
    */
    createRating: (newRating) => {
            myDatabase.collection("MatchRating").insertOne(newRating, function(err, result) {
                if (err) {
                    console.log('Error ' + err.message)
                }
                console.log('Created');
            });
    },

    /** 
     * @param {number} ratingID
    */
    deleteRating: (ratingID) => {
        console.log(ratingID)
        
            myDatabase.collection("MatchRating").deleteOne({ratingId:parseInt(ratingID)}, function(err, result) {
                if (err){
                    console.log('Error deleting: ' + err.message)
                }
                console.log('Deleted');
            });
    }
}

module.exports = {MatchRating}; 