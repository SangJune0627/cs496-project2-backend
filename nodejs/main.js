var http = require('http');
var url = require('url');
var querystring = require('querystring');
var mongoose = require('mongoose');


var contact = mongoose.Schema({
    id: Number,
    lookUp: Number,
    name: String,
    number: String,
    thumb: String
});
var Contact = mongoose.model('Contact', contact);

var contacts = mongoose.Schema({
    owner: String,
    contact_list: [contact]
});
var Contacts = mongoose.model('Contacts', contacts);

var gallery = mongoose.Schema({
    owner: Number,
    image_list: ["Mixed"],
    structure: {
        "children": {
            "type": [
                "Mixed"
            ]
        },
        "dirName": {
            "type": "String"
        },
        "imgAddr": {
            "type": "Number"
        },
        "type": {
            "type": "Number"
        }
    }
});
var Gallery = mongoose.model('Gallery', gallery);


connectDb();

var server = http.createServer(function (request, response) {

    console.log(request.url);

    var parsedUrl = url.parse(request.url);
    var resource = parsedUrl.pathname;
    var parsedquery = querystring.parse(parsedUrl.query, '&', '=');

    console.log('resource path: %s', resource);
    console.log(parsedquery);

    if (resource.indexOf('/contacts') == 0) {

        console.log('rest string: %s', resource.substring(9));

        if (request.method == 'GET') {
            response.writeHead(200, { 'Content-Type': 'application/json' });
            response.end(JSON.stringify({ "data": "Contacts" }));
        }
        else if (request.method == 'POST') {
            response.writeHead(201, { 'Content-Type': 'application/json' });
            response.end(JSON.stringify({ "data": "Contacts" }));
        }
        else {
            console.log("Not reached");
        }
    } else if (resource.indexOf('/gallery') == 0) {

        console.log('rest string: %s', resource.substring(8));

        if (resource.substring(8).indexOf('/image_list') == 0) {

            if (request.method == 'GET') {
                /// Get ImageList
                Gallery.findOne({ owner: parsedquery.owner }, function (error, data) {
                    if (error) {
                        console.log(error);
                    } else {
                        if (data == null) {
                            response.writeHead(404, { 'Content-Type': 'application/json' });
                            response.end(JSON.stringify({ "message": "Not Found" }));
                        } else {
                            response.writeHead(201, { 'Content-Type': 'application/json' });
                            response.end(JSON.stringify({ "data": JSON.parse(data.image_list) }));
                        }
                    }
                });
                //////////////////
            }
            else if (request.method == 'POST') {
                /// Post ImageList
                var body = '';
                request.on('data', function (data) {
                    body += data;
                });
                request.on('end', function () {
                    var parsed_body = JSON.parse(body);
                    Gallery.findOne({ owner: parsed_body.owner }, function (error, data) {
                        if (error) {
                            console.log(error);
                        } else {
                            if (data == null) {
                                response.writeHead(404, { 'Content-Type': 'application/json' });
                                response.end(JSON.stringify({ "message": "Not Found" }));
                            } else {
                                data.image_list = parsed_body.image_list;
                                data.save(function (error, modified_data) {
                                    if (error) {
                                        console.log(error);
                                    } else {
                                        console.log(modified_data);
                                        response.writeHead(201, { 'Content-Type': 'application/json' });
                                        response.end(JSON.stringify({ "data": modified_data }));
                                    }
                                });
                            }
                        }
                    });
                });
                ////////////////////
            }
            else {
                console.log("Not reached");
            }
        }
        else if (resource.substring(8).indexOf('/structure') == 0) {

        }
        else if (resource.substring(8).indexOf('/register') == 0) {
            if (request.method == 'GET') {
                /// Get ImageList

                //////////////////
            }
            else if (request.method == 'POST') {
                /// Post ImageList
                var body = '';
                request.on('data', function (data) {
                    body += data;
                });
                request.on('end', function () {
                    var parsed_body = JSON.parse(body);
                    Gallery.findOne({ owner: parsed_body.owner }, function (error, data) {
                        if (error) {
                            console.log(error);
                        } else {
                            if (data == null) {
                                var newData = new Gallery(parsed_body);
                                newData.save(function (error, data) {
                                    if (error) {
                                        console.log(error);
                                    } else {
                                        response.writeHead(201, { 'Content-Type': 'application/json' });
                                        response.end(JSON.stringify({ "data": data }));
                                    }
                                });
                            } else {
                                response.writeHead(404, { 'Content-Type': 'application/json' });
                                response.end(JSON.stringify({ "message": "Already Registered" }));
                            }
                        }
                    });
                });
                ////////////////////
            }
            else {
                console.log("Not reached");
            }
        }
        else {

        }
    } else if (resource.indexOf('/game') == 0) {

        console.log('rest string: %s', resource.substring(5));

        if (request.method == 'GET') {
            response.writeHead(200, { 'Content-Type': 'application/json' });
            response.end(JSON.stringify({ data: "Game!" }));
        }
        else if (request.method == 'POST') {
            response.writeHead(201, { 'Content-Type': 'application/json' });
            response.end(JSON.stringify({ data: "Game!" }));
        }
        else {
            console.log("Not reached");
        }
    } else {
        response.writeHead(404, { 'Content-Type': 'application/json' });
        response.end(JSON.stringify({ "message": "Not found" }));
    }
});

server.listen(3000, function () {
    console.log('Server is running...');
});

function connectDb() {
    mongoose.connect('mongodb://localhost:27017/testDB', { useNewUrlParser: true, useUnifiedTopology: true });
    var db = mongoose.connection;

    db.on('error', function () {
        console.log('DB Connection Failed!');
    });

    db.once('open', function () {
        console.log('DB Connected!');
    });
}