const { json } = require("express");

var contacts = mongoose.Schema({
    owner: String,
    contact_list: [contact]
});

var contact = mongoose.Schema({
    id: Number,
    lookUp: Number,
    name: String,
    number: String,
    thumb: String
});

var gallery = mongoose.Schema({
    owner: Number,
    image_list: String,
    structure: String
});
