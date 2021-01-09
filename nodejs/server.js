var http = require('http'); 
var mongoose = require('mongoose');

connectDb();

var teststring = mongoose.Schema({
    string : String
});

var Teststring = mongoose.model('Schema', teststring);

var server = http.createServer(function(request,response){ 

    if(request.method=='POST'){

        console.log("POST Connected");

        var postdata = '';

        request.on('data', function (data) {
            console.log("--- data ---");
            console.log(data);
            postdata = postdata + data;
        });

        request.on('end', function () {

            var newTestString = new Teststring({string:postdata});
            var id='';
            var getStringInDb = '';

            newTestString.save(function(error, data){
                console.log('--- Save data ---');
                if(error){
                    console.log(error);
                }else{
                    console.log(data);

                    id=data._id.toString();

                    Teststring.findOne({_id:id},function(error, string){
                        console.log('--- Read data ---');
                        if(error){
                            console.log(error);
                        }else{
                            console.log(string);

                            getStringInDb = string.string;

                            console.log('Get Data: ' + getStringInDb);

                            response.writeHead(201, {'Content-Type':'text/html'});
                            response.end('Data is: ' + getStringInDb + '\nIt works!');
                        }
                    })
                }
            });
        });
    }
    else if(request.method=='GET'){
        console.log("GET Connected");
        Teststring.find(function(error, string){
            console.log('--- Read data ---');
            if(error){
                console.log(error);
            }else{
                console.log(string);
            }
        })
        response.writeHead(200, {'Content-Type':'text/html'});
        response.end('Hello World!');
    }
    else{
        console.log("????");
        response.writeHead(404, {'Content-Type':'text/html'});
        response.end("That's nono!");
    }
});

server.listen(3000, function(){
    console.log('Server is running...');
});

function connectDb(){
    mongoose.connect('mongodb://localhost:27017/testDB',{ useNewUrlParser: true , useUnifiedTopology: true });
    var db = mongoose.connection;

    db.on('error', function(){
        console.log('DB Connection Failed!');
    });

    db.once('open', function() {
        console.log('DB Connected!');
    });
}