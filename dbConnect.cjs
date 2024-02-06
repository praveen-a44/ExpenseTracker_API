const {MongoClient} =require('mongodb')

let dbconnection //variable to store establised connection
 function connectToDb(callback) {
    MongoClient.connect('mongodb+srv://praveen44:R43u8gdeWzfOzYNO@cluster0.1rufvoa.mongodb.net/?retryWrites=true&w=majority').then(function(client){dbconnection=client.db()
    callback()
}).catch(function(error){
    callback(error)
        
    })
}
function getDb() {
    return dbconnection

}


module.exports={connectToDb,getDb} //exporting functions connectToDb,getDb 
