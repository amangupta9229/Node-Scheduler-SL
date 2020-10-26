const schedule = require("node-schedule")
var MongoClient = require('mongodb').MongoClient;
var url = 'mongodb://temp:temp123@52.172.181.199:32338/DB-singlecoll-test';


function getData(y){
    return y.find({status:1}).limit(50);
}

var TotalDuration=[]

function runLoop(response){
    
    var j=0;
    response.each(function(err, doc) {
        
            var totalDuration=0;
            console.log(doc)
            for(var i=0; i < doc.attempts.length; i++){

                var value = doc.attempts[i];
                totalDuration+=value.duration;
            }
            TotalDuration[j]=totalDuration;
            j++;
         });

}

schedule.scheduleJob( '0 0 * * *', () =>{
    MongoClient.connect(url, function (err, client) {
        if (err) throw err;

        var db = client.db('DB-singlecoll-test')
        var cursor = db.collection('OnlineClassAttendance')
        async function doWork(){
            const response = await getData(cursor)
            await runLoop(response,cursor)
        }
        doWork()
    }); 
});



