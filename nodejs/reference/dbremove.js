var Client = require('mongodb').MongoClient;

Client.connect('mongodb://localhost:27017/school', function(error, db){
    if(error) {
        console.log(error);
    } else {
        // 1. 삭제할 대상 쿼리
        var query = {name:'Joe'};
        // 2. remove 함수에 입력
        db.collection('student').remove(query,function(err,removed){
            if(err){
                console.log(err);
            }else{
                console.log('removed successfully!');
            }
        });
        db.close();
    }
});