var Client = require('mongodb').MongoClient;

Client.connect('mongodb://localhost:27017/school', function(error, db){
    if(error) {
        console.log(error);
    } else {
        var query = {}
        // 1. skip - 선택된 document 중에서 건너뛸 개수
        // 2. limit - 선택된 document 중에서 skip 다음 부터 가져올 개수
        //    현재 document 의 개수가 6개이면 2개를 건너띄고 3번째 부터 2개(3번과 4번)를 가져온다.
        var cursor = db.collection('student').find(query).skip(2).limit(2);
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