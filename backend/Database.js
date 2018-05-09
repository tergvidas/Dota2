const MongoClient = require('mongodb');
const fs = require('fs');
const connectionInfo = JSON.parse(fs.readFileSync(fs.openSync('./backend/DatabaseConfiguration.json', 'r')).toString());
const url = "mongodb://"+connectionInfo.username+":"+connectionInfo.password+"@"+connectionInfo.link;

const RatingObject = require("./DataObjects/Ratings");
let myDatabase = null;

let MatchRating = {
    connect: () => {
        MongoClient.connect(url, (err, client) => {               
            if(err){
            console.error(err);
            return;
            }
            myDatabase = client.db('dota2_db'); 
        });  
    },
    /**
     * @returns {Promise<number>}
     */
    getLastRatingId: () => {
        var mySort = { ratingId: -1 };
        return myDatabase.collection("MatchRating").find().sort(mySort).limit(1).toArray();
    },
    /** 
     * @param {Object} options filter options
     * @returns {Promise<Array<RatingObject>>} matches
    */
    getRatings: (options) => {
            let query = [{}];
            if (options.filter === 'true'){
                if (options.from === 'null')
                    options.from = 1;
                if (options.to === 'null')
                    options.to = 256111;
                
                query = [{ ratingId: { $lt : parseInt(options.to)+1} }, { ratingId: { $gt : parseInt(options.from)-1} }];
                if (options.both === 'false')
                    query.push({anonymous: options.anonymous});
            }
            return myDatabase.collection("MatchRating").find({$and: query}).limit(parseInt(options.showItems)).toArray();
    },

    /** 
     * @param {number} ratingID
     * @returns {Promise<RatingObject>} 
    */
   getRating: (ratingID) => {
            return myDatabase.collection("MatchRating").find({ratingId:parseInt(ratingID)}).toArray();
    },

    /** 
     * @param {RatingObject} newValues
    */
    updateRating: (newValues) => {
        let ratingID = newValues.ratingId;
        delete newValues['_id'];
        delete newValues['ratingId'];
            myDatabase.collection("MatchRating").updateOne({ratingId: parseInt(ratingID)}, {$set: newValues}, function(err, result) {
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