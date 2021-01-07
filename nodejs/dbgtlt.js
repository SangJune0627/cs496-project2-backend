var Client = require('mongodb').MongoClient;

Client.connect('mongodb://localhost:27017/school', function(error, db){
    if(error) {
        console.log(error);
    } else {
        // 1. gender 가 'F' 이면서 age 가 16보다 크고 19보다 작은 값 선택
        var query = {gender:'F', age:{'$gt':16,'$lt':19}};
        var cursor = db.collection('student').find(query);
        cursor.each(function(err,doc){
            if(err){
                console.log(err);
            }else{
                if(doc != null){
                    // 2. 출력할 document 에서 name 필드만 출력
                    console.log('student name:'+doc.name);
                }
            }
        });
        db.close();
    }
});