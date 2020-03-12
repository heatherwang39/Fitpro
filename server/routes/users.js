/*
 * Routes for creating, retrieving, and modifying users
 */

const express = require("express");

const router = express.Router();
const ObjectId = require("mongodb").ObjectID;
const User = require("../models/user");

// Register
router.post("/", (req, res) => {
    if (!req.body || req.body.email === undefined
        || req.body.password === undefined || req.body.username === undefined) {
        res.status(400).send();
        return;
    }
    const user = new User(req.body);
    const { password, ...resUser } = user._doc; // Don't send password in response
    user.save((err) => {
        if (err) {
            console.log("error in /users POST", err);
            res.status(500).send(); // This should sometimes be a 400 e.g. existing email/username
        } else res.status(201).send(resUser);
    });
});

router.get("/", (req, res) => {
    if (!req.query || !req.query.id) {
        res.status(400).send();
        return;
    }
    if (req.query.id.length !== 24) { // default length of _id
        res.status(404).send();
        return;
    }
    User
        .findOne({ _id: ObjectId(req.query.id) })
        .populate("trainers clients", "_id username firstname lastname")
        .exec((err, user) => {
            if (err) {
                console.log("error in /users GET", err);
                res.status(500).send();
                return;
            }
            if (!user) {
                res.status(404).send();
            }
            res.setHeader("Content-Type", "application/json");
            res.status(200);
            res.json(user.populate());
        });
});


module.exports = router;
