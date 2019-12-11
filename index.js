// implement your API here
const express = require("express");
const dbase = require("./data/db.js");
const server = express();
server.use(express.json());

server.get("/", (req, res) => {
  res.send("THIS CODE IS WORKING.");
});

server.get("/api/users", (req, res) => {
  dbase
    .find()
    .then(users => {
      res.send(users);
    })
    .catch(err => {
      res.status(550).json({ error: "User could not be found." });
    });
});

server.get("/api/users/:id", (req, res) => {
  const id = req.params.id;
  dbase
    .findById(id)
    .then(user => {
      if (!user) {
        res
          .status(404)
          .json({ error: "That user ID doesn't exist on this server." });
      } else {
        res.json(user);
      }
    })
    .catch(error => {
      res
        .status(400)
        .json({ error: "The users description is not available." });
    });
});

server.post("/api/users", (req, res) => {
  const userDesc = req.body;
  if (!userDesc.name || !userDesc.bio) {
    res.status(400).json({ error: "Enter a name and bio for this user." });
  } else {
    dbase
      .insert(userDesc)
      .then(user => {
        res.status(201).json(user);
      })
      .catch(err => {
        res.json({ error: "The user was not added." });
      });
  }
});

server.delete("/api/users/:id", (req, res) => {
  const id = req.params.id;
  dbase.findById(id).then(user => {
    if (!user) {
      res.status(404).json({ error: "User ID does not exist." });
    } else {
      dbase
        .remove(id)
        .then(hub => {
          res.status(201).json(hub);
        })
        .catch(error => {
          res
            .status(500)
            .json({ error: "Error: the user could not be deleted." });
        });
    }
  });
});
server.put("/api/users/:id", (req, res) => {
  const id = req.params.id;
  const modify = req.body;
  dbase.findById(id).then(user => {
    if (!user) {
      res.status(404).json({ message: "User ID does not exist." });
    } else if (!modify.name || !modify.bio) {
      res
        .status(400)
        .json({ error: "Please enter missing fields 1) username 2)bio" });
    } else {
      dbase
        .update(id, modify)
        .then(hub => {
          res.status(200).json(hub);
        })
        .catch(error => {
          res.status(500).json({ message: "User was not modified." });
        });
    }
  });
});

const port = 8000;
server.listen(port, () => console.log("The server is running on port 8000."));
