var Client = require('mongodb').MongoClient;

Client.connect('mongodb://localhost:27017/school', function(error, db){
    if(error) {
        console.log(error);
    } else {
        // 1. 쿼리작성
        var query = {gender:'M'};
        // 2. 읽어올 Field 선택
        var projection = {name:1,age:1,_id:0};
        // 3. find() 함수에 작성된 query와 projection을 입력
        var cursor = db.collection('student').find(query,projection);
        cursor.each(function(err,doc){
            if(err){
                console.log(err);
            }else{
                if(doc != null){
                    console.log(doc);
                }
            }
        });
        db.close();
    }
});