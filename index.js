var express = require("express");
var path = require("path");
var fs = require("fs");

var app = express();
var PORT = 3000;


app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));


app.get("/notes", function(req, res) {
    res.sendFile(path.join(__dirname, "public", "notes.html"));
});

app.get("/api/notes", function(req, res) {
    var filepath = path.join(__dirname, "db", "db.json")
    fs.readFile(filepath, (err, data) => {
        if (err) throw err;
        let notes = JSON.parse(data);
        return res.json(notes);
    });
})

app.post("/api/notes", function(req, res) {
    var filepath = path.join(__dirname, "db", "db.json")
    var newNote = req.body;
    fs.readFile(filepath, (err, data) => {
        if (err) throw err;
        let notes = JSON.parse(data);
        var d = new Date();
        var id = d.getTime();
        newNote.id = id;
        notes.push(newNote);
        let notesString = JSON.stringify(notes);
        fs.writeFile(filepath, notesString, (err, data) => {
            if (err) throw err;
            return res.json(newNote);
        })
    });
})

app.delete("/api/notes/:id", function(req, res) {
    var filepath = path.join(__dirname, "db", "db.json");
    var id = parseInt(req.params.id);
    fs.readFile(filepath, (err, data) => {
        if (err) throw err;
        let notes = JSON.parse(data);
        var filtered = notes.filter(function(value, index, arr){ 
            return value.id != id;
        });
        let notesString = JSON.stringify(filtered);
        fs.writeFile(filepath, notesString, (err, data) => {
            if (err) throw err;
            return res.json(id);
        })
    })
});


// Starts the server to begin listening
// =============================================================
app.listen(PORT, function() {
    console.log("App listening on PORT " + PORT);
  });