/*
 * Routes for creating, retrieving, and modifying users
 */

const express = require("express");

const router = express.Router();
const ObjectId = require("mongodb").ObjectID;
require("../models/mail");
const Mail = require("../models/mail");

// Create Mail
router.post("/", (req, res) => {
    if (!req.user) {
        res.status(401).send();
        return;
    }
    if (!req.body) {
        res.status(400).send();
        return;
    }

    const { title, receiverId, content } = req.body;
    const mail = new Mail({ 
        title,
        receiverId,
        content,
        sentDate: (new Date()).getTime(),
        ownerId: req.user._id
    });
    mail.save((err) => {
        if (err) {
            console.log("error in POST /mail", err);
            res.status(err.name === "ValidationError" ? 400 : 500).send();
            return;
        }
        mail.populate("mail.mail").execPopulate().then(
            () => res.status(201).send(mail),
        );
    });
});

// Get Mail
router.get("/", (req, res) => {
    if (!req.user) {
        res.status(401).send();
        return;
    }
    if (!req.query || !req.query.id) {
        res.status(400).send();
        return;
    }
    if (req.query.id.length !== 24) { // default length of _id
        res.status(400).send("Invalid ID");
        return;
    }
    const { page } = req.query;
    Mail.paginate({ 
        ownerId: ObjectId(req.user._id) 
    }, { populate: { path: "mail.mail", limit: 3 }, page }).then((mail) => {
        res.setHeader("Content-Type", "application/json");
        res.status(200);
        res.json(mail);
    });

});

// Update Mail
router.delete("/", async (req, res) => {
    if (!req.body) {
        res.status(400).send();
        return;
    }
    if (!req.user) {
        res.status(401).send();
        return;
    }
    const { id } = req.query
    Mail.deleteOne({ _id: id }, (err) => {
        res.status(200).send()
    })
});


module.exports = router;
