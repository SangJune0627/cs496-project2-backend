var http = require('http');
var url = require('url');
var querystring = require('querystring');
var mongoose = require('mongoose');
const { parse } = require('path');

var contacts = mongoose.Schema({
    owner: String,
    contact_list: [{
        "id": {
            "type": "Number"
        },
        "lookUp": {
            "type": "Number"
        },
        "name": {
            "type": "String"
        },
        "number": {
            "type": "String"
        },
        "thumb": {
            "type": "String"
        }
    }]
});
var Contacts = mongoose.model('Contacts', contacts);

var gallery = mongoose.Schema({
    owner: Number,
    image_list: [{
        "type": {
            "type": "Number"
        },
        "fd": {
            "type": "String"
        },
        "bitmap": {
            "type": "Mixed"
        }
    }],
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

    var parsedUrl = url.parse(request.url);
    var resource = parsedUrl.pathname;
    var parsedquery = querystring.parse(parsedUrl.query, '&', '=');

    if (resource.indexOf('/contacts') == 0) {

        if (request.method == 'GET') {
            /// Get Contacts
            getContacts(response, parsedquery);
            ////////////////
        }
        else if (request.method == 'POST') {
            /// Post Contacts
            postContacts(request, response);
            /////////////////
        }
        else {
            console.log("Not reached");
        }
    } else if (resource.indexOf('/gallery') == 0) {

        if (resource.substring(8).indexOf('/image_list') == 0) {

            if (request.method == 'GET') {
                /// Get ImageList
                getImageList(response, parsedquery);
                //////////////////
            }
            else if (request.method == 'POST') {
                /// Post ImageList
                postImageList(request, response);
                ////////////////////
            }
            else {
                console.log("Not reached");
            }
        }
        else if (resource.substring(8).indexOf('/structure') == 0) {
            if (request.method == 'GET') {
                /// Get Structure
                getStructure(response, parsedquery);
                //////////////////
            }
            else if (request.method == 'POST') {
                /// Post Structure
                postStructure(request, response);
                ////////////////////
            }
            else {
                console.log("Not reached");
            }
        }
        else if (resource.substring(8).indexOf('/all') == 0) {
            if (request.method == 'GET') {
                /// Get All
                getAll(response, parsedquery);
                //////////////////
            }
            else if (request.method == 'POST') {
                /// Post All
                postAll(request, response);
                ////////////////////
            }
            else {
                console.log("Not reached");
            }
        }
        else {

        }
    } else if (resource.indexOf('/game') == 0) {
        if (resource.substring(5).indexOf('/omok') == 0) {
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
        }
    } else {
        response.writeHead(404, { 'Content-Type': 'application/json' });
        response.end(JSON.stringify({ "message": "Not found" }));
    }
});

server.listen(4000, function () {
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

function getContacts(response, parsedquery) {
    Contacts.findOne({ owner: parsedquery.owner }, function (error, data) {
        if (error) {
            console.log(error);
        } else {
            if (data == null) {
                response.writeHead(404, { 'Content-Type': 'application/json' });
                response.end(JSON.stringify({ "message": "Not Found" }));
            } else {
                response.writeHead(200, { 'Content-Type': 'application/json' });
                response.end(JSON.stringify({ "data": data.contact_list }));
            }
        }
    });
}

function postContacts(request, response) {
    var body = '';
    request.on('data', function (data) {
        body += data;
    });
    request.on('end', function () {
        var parsed_body = JSON.parse(body);
        Contacts.findOne({ owner: parsed_body.owner }, { contact_list: 1 }, function (error, data) {
            if (error) {
                console.log(error);
            } else {
                if (data == null) {
                    var contacts = [];
                    for (each of parsed_body.contact_list) {
                        contacts.push(each);
                    }
                    var newContacts = new Contacts({ owner: parsed_body.owner, contact_list: contacts });
                    newContacts.save(function (error, newdata) {
                        if (error) {
                            console.log(error);
                        } else {
                            response.writeHead(201, { 'Content-Type': 'application/json' });
                            response.end(JSON.stringify({ "data": newdata.contact_list }));
                        }
                    });
                } else {
                    data.contact_list = parsed_body.contact_list;
                    data.save(function (error, modified_data) {
                        if (error) {
                            console.log(error);
                        } else {
                            response.writeHead(201, { 'Content-Type': 'application/json' });
                            response.end(JSON.stringify({ "data": modified_data.contact_list }));
                        }
                    });
                }
            }
        });
    });
}

function getImageList(response, parsedquery) {
    Gallery.findOne({ owner: parsedquery.owner }, { image_list: 1 }, function (error, data) {
        if (error) {
            console.log(error);
        } else {
            if (data == null) {
                response.writeHead(404, { 'Content-Type': 'application/json' });
                response.end(JSON.stringify({ "message": "Not Found" }));
            } else {
                response.writeHead(200, { 'Content-Type': 'application/json' });
                response.end(JSON.stringify({ "data": data.image_list }));
            }
        }
    });
}

function postImageList(request, response) {
    var body = '';
    request.on('data', function (data) {
        body += data;
    });
    request.on('end', function () {
        var parsed_body = JSON.parse(body);
        Gallery.findOne({ owner: parsed_body.owner }, { image_list: 1 }, function (error, data) {
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
                            response.writeHead(201, { 'Content-Type': 'application/json' });
                            response.end(JSON.stringify({ "data": modified_data.image_list }));
                        }
                    });
                }
            }
        });
    });
}

function getStructure(response, parsedquery) {
    Gallery.findOne({ owner: parsedquery.owner }, { structure: 1 }, function (error, data) {
        if (error) {
            console.log(error);
        } else {
            if (data == null) {
                response.writeHead(404, { 'Content-Type': 'application/json' });
                response.end(JSON.stringify({ "message": "Not Found" }));
            } else {
                response.writeHead(200, { 'Content-Type': 'application/json' });
                response.end(JSON.stringify({ "data": data.structure }));
            }
        }
    });
}

function postStructure(request, response) {
    var body = '';
    request.on('data', function (data) {
        body += data;
    });
    request.on('end', function () {
        var parsed_body = JSON.parse(body);
        Gallery.findOne({ owner: parsed_body.owner }, { structure: 1 }, function (error, data) {
            if (error) {
                console.log(error);
            } else {
                if (data == null) {
                    response.writeHead(404, { 'Content-Type': 'application/json' });
                    response.end(JSON.stringify({ "message": "Not Found" }));
                } else {
                    data.structure = parsed_body.structure;
                    data.save(function (error, modified_data) {
                        if (error) {
                            console.log(error);
                        } else {
                            response.writeHead(201, { 'Content-Type': 'application/json' });
                            response.end(JSON.stringify({ "data": modified_data.structure }));
                        }
                    });
                }
            }
        });
    });
}

function getAll(response, parsedquery) {
    Gallery.findOne({ owner: parsedquery.owner }, { image_list: 1, structure: 1 }, function (error, data) {
        if (error) {
            console.log(error);
        } else {
            if (data == null) {
                response.writeHead(404, { 'Content-Type': 'application/json' });
                response.end(JSON.stringify({ "message": "Not Found" }));
            } else {
                response.writeHead(200, { 'Content-Type': 'application/json' });
                response.end(JSON.stringify({ "data": { image_list: data.image_list, structure: data.structure } }));
            }
        }
    });
}

function postAll(request, response) {
    var body = '';
    request.on('data', function (data) {
        body += data;
    });
    request.on('end', function () {
        var parsed_body = JSON.parse(body);
        Gallery.findOne({ owner: parsed_body.owner }, { image_list: 1, structure: 1 }, function (error, data) {
            if (error) {
                console.log(error);
            } else {
                if (data == null) {
                    var newData = new Gallery(parsed_body);
                    newData.save(function (error, newdata) {
                        if (error) {
                            console.log(error);
                        } else {
                            response.writeHead(201, { 'Content-Type': 'application/json' });
                            response.end(JSON.stringify({ "data": newdata }));
                        }
                    });
                } else {
                    data.image_list = parsed_body.image_list;
                    data.structure = parsed_body.structure;
                    data.save(function (error, modified_data) {
                        if (error) {
                            console.log(error);
                        } else {
                            response.writeHead(201, { 'Content-Type': 'application/json' });
                            response.end(JSON.stringify({ "data": { image_list: modified_data.image_list, structure: modified_data.structure } }));
                        }
                    });
                }
            }
        });
    });
}