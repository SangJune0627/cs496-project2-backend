var http = require('http');
var url = require('url');
var querystring = require('querystring');
var mongoose = require('mongoose');

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
            "type": "Number"
        },
        "bitmap": {
            "type": "Mixed"
        },
        "bitmapStr": {
            "type": "String"
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

var users = []
var rooms = []

class User {
    constructor(id, name) {
        this.id = id;
        this.name = name;
    }
}

var testuser1 = new User(1, "이영석");
users.push(testuser1);
var testuser2 = new User(2, "정지영");
users.push(testuser2);
var testuser3 = new User(3, "이우현");
users.push(testuser3);

class Room {
    constructor(user1, roomnumber) {
        this.roomnumber = roomnumber;
        this.user1 = user1;
        this.user2 = null;
        this.state = "wait";
        this.lastmove = { "turn": null, "x": null, "y": null }
    }

    enterRoomAndStart(user2) {
        this.user2 = user2;
        this.lastmove = { "turn": user2.id, "x": null, "y": null }
        this.state = "play";
    }

    // startGame() {
    //     this.state = "play"
    // }

    exitRoom(user) {
        if (this.state == "play") {
            if (user.id == this.user1.id) {
                this.user1 = this.user2;
            }
            this.user2 = null;
            this.state = "wait";
        }
        else {
            this.state = "boom";
        }
    }

    setCoordinates(turn, x, y) {
        this.lastmove = { "turn": turn, "x": x, "y": y }
    }

}

var testroom1 = new Room(testuser1, 0);
rooms.push(testroom1);
var testroom2 = new Room(testuser2, 1);
rooms.push(testroom2);
var testroom3 = new Room(testuser3, 2);
rooms.push(testroom3);

function findUser(id) {
    for (each of users) {
        if (each.id == id)
            return each;
    }
}

function getEmptyRoomNumber() {
    return rooms.length
}

function getRooms(response, parsedquery) {
    var already = false;
    for (user of users) {
        if (user.id == Number(parsedquery.id)) {
            already = true;
            break;
        }
    }
    if (!already) {
        var newUser = new User(Number(parsedquery.id), parsedquery.name);
        users.push(newUser);
    }
    console.log(users);
    console.log(rooms);
    response.writeHead(200, { 'Content-Type': 'application/json' });
    response.end(JSON.stringify({ "data": rooms }));
}

function makeRoom(request, response) {
    var body = '';
    request.on('data', function (data) {
        body += data;
    });
    request.on('end', function () {
        var parsed_body = JSON.parse(body);
        var room = new Room(findUser(parsed_body.id), getEmptyRoomNumber());
        rooms.push(room);
        response.writeHead(201, { 'Content-Type': 'application/json' });
        response.end(JSON.stringify({ "data": [room] }));
    });
}

function enterRoomAndStart(request, response) {
    var body = '';
    request.on('data', function (data) {
        body += data;
    });
    request.on('end', function () {
        var parsed_body = JSON.parse(body);
        var room = rooms[parsed_body.roomnumber];
        room.enterRoomAndStart(findUser(parsed_body.id));
        response.writeHead(201, { 'Content-Type': 'application/json' });
        response.end(JSON.stringify({ "data": [room] }));
    });
}

function turn(request, response) {
    var body = '';
    request.on('data', function (data) {
        body += data;
    });
    request.on('end', function () {
        var parsed_body = JSON.parse(body);
        var room = rooms[parsed_body.roomnumber];
        room.setCoordinates(parsed_body.id, parsed_body.coordinates.x, parsed_body.coordinates.y);
        response.writeHead(201, { 'Content-Type': 'application/json' });
        response.end(JSON.stringify({ "data": [room] }));
    });
}

function wait(response, parsedquery) {
    var room = rooms[Number(parsedquery.roomnumber)];
    response.writeHead(200, { 'Content-Type': 'application/json' });
    response.end(JSON.stringify({ "data": [room] }));
}

function movewait(response, parsedquery) {
    var room = rooms[Number(parsedquery.roomnumber)];
    response.writeHead(200, { 'Content-Type': 'application/json' });
    response.end(JSON.stringify({ "data": [room.lastmove] }));
}

var server = http.createServer(function (request, response) {

    console.log("Connected")

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
        if (resource.substring(8).indexOf('/all') == 0) {
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
            console.log("Not reached");
        }
    } else if (resource.indexOf('/game') == 0) {
        if (resource.substring(5).indexOf("/turn") == 0) {
            turn(request, response);
        } else if (resource.substring(5).indexOf("/room") == 0) {
            getRooms(response, parsedquery);
        } else if (resource.substring(5).indexOf("/makeroom") == 0) {
            makeRoom(request, response);
        } else if (resource.substring(5).indexOf("/enterroom") == 0) {
            enterRoomAndStart(request, response);
        } else if (resource.substring(5).indexOf("/wait") == 0) {
            wait(response, parsedquery);
        } else if (resource.substring(5).indexOf("/movewait") == 0) {
            movewait(response, parsedquery);
        } else if (resource.substring(5).indexOf("/exitroom") == 0) {

        } else if (resource.substring(5).indexOf("/end") == 0) {

        } else {
            console.log("Not Reached")
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
    console.log("겟들어옴")
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
        console.log(body)
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
        console.log(body)
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