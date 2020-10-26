const schedule = require("node-schedule")
let MongoClient = require('mongodb').MongoClient;
let url = 'mongodb://temp:temp123@52.172.181.199:32338/DB-singlecoll-test';


function getData(y){
    return y.find({status:1}).limit(50);
}

let TotalDuration=[]

function runLoop(response){
    
    let j=0;
    response.each(function(err, doc) {
        
            let totalDuration=0;
           
            if(doc!=null){
            for(let i=0; i < doc.attempts.length; i++){

                
                let value = doc.attempts[i];
                totalDuration+=value.duration;
                
            }
        
        
            let temp=doc;
            temp.TotalDuration=totalDuration;
            console.log(temp)
            TotalDuration[j]=totalDuration;
            j++;
        }
         });

}

schedule.scheduleJob( '0 0 * * *', () =>{
    MongoClient.connect(url, function (err, client) {
        if (err) throw err;

        let db = client.db('DB-singlecoll-test')
        let cursor = db.collection('OnlineClassAttendance')
        async function doWork(){
            const response = await getData(cursor)
            await runLoop(response,cursor)
        }
        doWork()
    }); 
});



