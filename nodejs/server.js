var http = require('http'); 
var mongoose = require('mongoose');
var querystring = require('querystring');

mongoose.connect('mongodb://localhost:27017/testDB',{ useNewUrlParser: true , useUnifiedTopology: true });
var db = mongoose.connection;

db.on('error', function(){
    console.log('Connection Failed!');
});

db.once('open', function() {
    console.log('Connected!');
});

var teststring = mongoose.Schema({
    string : 'string'
});

var Teststring = mongoose.model('Schema', teststring);

var server = http.createServer(function(request,response){ 

    if(request.method=='POST'){

        console.log("POST Connected");

        var postdata = '';

        request.on('data', function (data) {
            postdata = postdata + data;
            console.log("Data Connected");
        });

        request.on('end', function () {

            var newTestString = new Teststring({string:postdata});
            var getStringInDb = '';
            var id='';
            newTestString.save(function(error, data){
                if(error){
                    console.log(error);
                }else{
                    console.log('Saved!');
                    id=data._id;
                }
            });

            Teststring.findOne({_id:id},function(error, string){
                console.log('--- Read all ---');
                if(error){
                    console.log(error);
                }else{
                    console.log(string);
                    getStringInDb = string;
                }
            })

            response.writeHead(201, {'Content-Type':'text/html'});
            response.end('Data is: ' + getStringInDb+ "\nIt works!");
        });
    }
    else if(request.method=='GET'){
        console.log("GET Connected");
        response.writeHead(200, {'Content-Type':'text/html'});
        response.end("Hello world!!!!~~~");
    }
    else{
        console.log("????");
        response.writeHead(404, {'Content-Type':'text/html'});
        response.end("That's nono!");
    }
});

// 3. listen 함수로 8080 포트를 가진 서버를 실행한다. 서버가 실행된 것을 콘솔창에서 확인하기 위해 'Server is running...' 로그를 출력한다
server.listen(3000, function(){
    console.log('Server is running...');
});