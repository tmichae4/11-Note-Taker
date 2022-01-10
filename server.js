// create functions for express and fileSystem, this will allow them to interact with the front end code
const path = require("path");
const express = require("express");
const fs = require("fs");
const PORT = process.env.PORT || 3001;
const app = express();
const notes = JSON.parse(fs.readFileSync("./db/db.json", "utf8"));
const uniqid = require("uniqid");

app.use(express.static("public"));
app.use(express.json());

// get notes.html and return data from the html to generate
app.get("/notes", (req, res) => {
  res.sendFile(path.join(__dirname, "/public/notes.html"));
});

// Get notes by specific ID
app.get("/notes/:id", (req, res) => {
  res.json(notes(req.params.id));
});

// read the db.json file and return all of the saved notes as JSON files
app.get("/api/notes", (req, res) => {
  fs.readFile("./db/db.json", function (err, text) {
    const dbData = JSON.parse(text);
    console.log(dbData);
    res.json(dbData);
  });
});

// delete notes by their id
app.delete("/api/notes/:id", (req, res) => {
  fs.readFile("./db/db.json", function (err, text) {
    const dbData = JSON.parse(text);
    const filterData = dbData.filter((note) => note.id !== req.params.id);
    fs.writeFile("./db/db.json", JSON.stringify(filterData), (err) => {
      if (err) console.log(err);
      res.json(filterData);
    });
  });
});

// write an app. post route with route /api/notes

app.post("/api/notes", (req, res) => {
  fs.readFile("./db/db.json", function (err, text) {
    const dbData = JSON.parse(text);
    console.log(dbData);
    const idNotes = req.body;
    idNotes.id = uniqid();
    dbData.push(idNotes);

    fs.writeFile("./db/db.json", JSON.stringify(dbData), (err) => {
      if (err) console.log(err);
      res.json(dbData);
    });
  });
});

// get index.html and return data inside the file
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "/public/index.html"));
});

app.listen(PORT, () => console.log(3001));
