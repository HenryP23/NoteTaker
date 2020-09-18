var express = require("express");
var path = require("path");
var fs = require("fs");
var db = require("./db/db.json");

var PORT = process.env.PORT || 3000;
var app = express();

app.use(express.static("public"));

app.use(express.urlencoded({
    extended: true
}));
app.use(express.json());

app.get("/", function (req, res) {
    res.sendFile(path.join(__dirname, "public/index.html"));
});

app.get("/notes", function (req, res) {
    res.sendFile(path.join(__dirname, "public/notes.html"));
});

//reads db.json file, sends read data to /api/ntoes url extension. 
app.get("/api/notes", (req, res) => {
    db = JSON.parse(fs.readFileSync("./db/db.json", "utf8"));
    console.log("GET", db);
    res.json(db);
});

app.post("/api/notes", (req, res) => {
    var newNote = {
        id: Math.floor(Math.random() * 100) + 1,
        title: req.body.title,
        text: req.body.text
    }

    db.push(newNote);

    fs.writeFileSync("./db/db.json", JSON.stringify(db), function (err, res) {
        if (err) throw err;
        console.log("POST", db, res);
    });
    res.json(db);
});

app.delete("/api/notes/:id", (req, res) => {
    var undeletedNotes = [];
    console.log("DELETE", req.params.id);
    for (var i = 0; i < db.length; i++) {
        if (db[i].id != req.params.id) {
            undeletedNotes.push(db[i]);
        }
    }
    db = undeletedNotes;
    fs.writeFileSync("./db/db.json", JSON.stringify(db), function (err, res) {
        if (err) throw err;
    });
    console.log("Delete", db);
    res.json(db);
});

module.exports = app;



app.listen(PORT, function () {
    console.log("App listening on PORT http://localhost:" + PORT);
});