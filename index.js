var express = require('express');
var bodyParser = require('body-parser');
var DataStore = require('nedb');
var cors = require('cors');

var port = 3000;
var BASE_API_PATH = "/api/v1";
var dbFilename = __dirname + "/contacts.json";
var path = require('path');
const CONTACTS_APP_DIR = "/dist/contacts-app";

console.log("Starting API server...");

var app = express();
app.use(bodyParser.json());
app.use(cors());
app.use(express.static(path.join(__dirname, CONTACTS_APP_DIR))); 

var initialContacts = [
    {"name": "pepe","phone": 984847},
    {"name": "luis","phone": 9563863}
];

var db = new DataStore({
    filename : dbFilename,
    autoload : true
});

db.find({},(err,contacts)=>{
    if(err){
        console.error("Error accesing DB");
        process.exit(1);
    }else{
        if(contacts.length == 0){
            console.log("Empty DB, initializing data...");
            db.insert(initialContacts);
        }else{
            console.log("Loaded DB with "+contacts.length+" contacts.");
        }
           
    }
});

app.get('/', function(req, res) { 
    res.sendFile(path.join(__dirname, CONTACTS_APP_DIR, '/index.html')); 
    }); 

app.get(BASE_API_PATH + "/contacts", (req, res) => {
    console.log(Date() + " - GET /contacts");
    db.find({}, (err, contacts) => {
        if (err) {
            console.error("Error accessing DB");
            res.sendStatus(500);
        } else {
            res.send(contacts.map((contact) => {
                delete contact._id;
                return contact;
            }));
        }
    })
});

app.post(BASE_API_PATH + "/contacts", (req, res) => {
    console.log(Date() + " - POST /contacts");
    var contact = req.body;
    db.insert(contact);
    res.sendStatus(201);
});

app.put(BASE_API_PATH + "/contacts", (req, res) => {
    // Forbidden
    console.log(Date()+" - PUT /contacts");

    res.sendStatus(405);
});

app.delete(BASE_API_PATH + "/contacts", (req, res) => {
    // Remove all contacts
    console.log(Date()+" - DELETE /contacts");

    db.remove({});
    
    res.sendStatus(200);
});


app.post(BASE_API_PATH + "/contacts/:name", (req, res) => {
    // Forbidden
    console.log(Date()+" - POST /contacts");

    res.sendStatus(405);
});



app.get(BASE_API_PATH + "/contacts/:name", (req, res) => {
    // Get a single contact
    var name = req.params.name;
    console.log(Date()+" - GET /contacts/"+name);

    db.find({"name": name},(err,contacts)=>{
        if(err){
            console.error("Error accesing DB");
            res.sendStatus(500);
        }else{
            if(contacts.length>1){
                console.warn("Incosistent DB: duplicated name");
            }
            res.send(contacts.map((contact)=>{
                delete contact._id;
                return contact;
            })[0]);
        }
    });
});


app.delete(BASE_API_PATH + "/contacts/:name", (req, res) => {
    // Delete a single contact
    var name = req.params.name;
    console.log(Date()+" - DELETE /contacts/"+name);

    db.remove({"name": name},{},(err,numRemoved)=>{
        if(err){
            console.error("Error accesing DB");
            res.sendStatus(500);
        }else{
            if(numRemoved>1){
                console.warn("Incosistent DB: duplicated name");
            }else if(numRemoved == 0) {
                res.sendStatus(404);
            } else {
                res.sendStatus(200);
            }
        }
    });
});

app.put(BASE_API_PATH + "/contacts/:name", (req, res) => {
    // Update contact
    var name = req.params.name;
    var updatedContact = req.body;
    console.log(Date()+" - PUT /contacts/"+name);

    if(name != updatedContact.name){
        res.sendStatus(409);
        return;
    }

    db.update({"name": name},updatedContact,(err,numUpdated)=>{
        if(err){
            console.error("Error accesing DB");
            res.sendStatus(500);
        }else{
            if(numUpdated>1){
                console.warn("Incosistent DB: duplicated name");
            }else if(numUpdated == 0) {
                res.sendStatus(404);
            } else {
                res.sendStatus(200);
            }
        }
    });
});

app.listen(port);

console.log("Server ready with static content!");