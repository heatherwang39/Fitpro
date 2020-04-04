/*
 * Routes for creating, retrieving, and modifying users
 */

const express = require("express");

const router = express.Router();
const ObjectId = require("mongodb").ObjectID;
require("../models/mail");
const User = require("../models/user");
const Mail = require("../models/mail");

// Create Mail
router.post("/", async (req, res) => {
    if (!req.user) {
        res.status(401).send();
        return;
    }
    if (!req.body) {
        res.status(400).send();
        return;
    }

    try {
        const { title, receiver, content } = req.body;
        const receiverId = (await User.findOne({
            username: receiver,
        }))._id
        console.log(receiverId)
        const mail = new Mail({ 
            title,
            receiver: receiverId,
            content,
            sentDate: (new Date()).getTime(),
            owner: req.user._id
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
    } catch(e) {
        res.status(400).send();
        return;
    }
});

// Get Mail
router.get("/", (req, res) => {
    if (!req.user) {
        res.status(401).send();
        return;
    }
    const { page } = req.query;
    Mail.paginate({ 
        receiver: ObjectId(req.user._id) 
    }, { populate: ["owner", "receiver"], page }).then((mail) => {
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
