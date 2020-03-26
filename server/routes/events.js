/*
 * Routes for creating, retrieving, and modifying users
 */

const express = require("express");

const router = express.Router();
const ObjectId = require("mongodb").ObjectID;
require("../models/event");
const Event = require("../models/event");


// Create
router.post("/", (req, res) => {
    if (!req.user) {
        res.status(401).send();
        return;
    }
    if (!req.body) {
        res.status(400).send();
        return;
    }

    const { title, description, clientId, datetime } = req.body;
    const event = new Event({ 
        title,
        description,
        clientId,
        datetime,  
        ownerId: req.user._id,
    });
    event.save((err) => {
        if (err) {
            console.log("error in POST /events", err);
            res.status(err.name === "ValidationError" ? 400 : 500).send();
            return;
        }
        event.populate("event.event").execPopulate().then(
            () => res.status(201).send(event),
        );
    });
});

// Get events
router.get("/", (req, res) => {
    if (!req.user) {
        res.status(401).send();
        return;
    }
    if (!req.query) {
        res.status(400).send();
        return;
    }
    if (req.query.id) {
        if (req.query.id.length !== 24) { // default length of _id
            res.status(400).send("Invalid ID");
            return;
        }
        Event.findOne({ _id: ObjectId(req.query.id) }).populate("events.event").exec((err, event) => {
            if (err) {
                console.log("Error in GET /events by id", err);
                res.status(500).send();
                return;
            }
            if (!event) {
                res.status(404).send("No event with that ID");
                return;
            }
            res.setHeader("Content-Type", "application/json");
            res.status(200);
            res.json(event.populate());
        });
        return;
    }
    const { minDate, maxDate, page } = req.query
    console.log(req.user._id)
    Event.paginate({
        ownerId: req.user._id,
        datetime: {
            $lte: maxDate,
            $gte: minDate
        }
    }, { populate: { path: "events.event", limit: 3 }, page }).then((events) => {
        res.setHeader("Content-Type", "application/json");
        res.status(200);
        res.json(events);
    });
});

router.get("/trainer", (req, res) => {
    if (!req.query) {
        res.status(400).send();
        return;
    }
    const { userId, page } = req.query;
    Event.paginate({
        owner: userId
    }, { populate: { path: "events.event", limit: 3 }, page }).then((workouts) => {
        res.setHeader("Content-Type", "application/json");
        res.status(200);
        res.json(workouts);
    });
});

router.get("/client", (req, res) => {
    if (!req.query) {
        res.status(400).send();
        return;
    }
    const { userId, page } = req.query;
    Event.paginate({
        clientId: userId
    }, { populate: { path: "events.event", limit: 3 }, page }).then((workouts) => {
        res.setHeader("Content-Type", "application/json");
        res.status(200);
        res.json(workouts);
    });
});

router.get("/all", (req, res) => {
    if (!req.query) {
        res.status(400).send();
        return;
    }
    const { userId, page } = req.query;
    Event.paginate({
        $or: [ {clientId: userId}, {owner: userId}]
        
    }, { populate: { path: "events.event", limit: 3 }, page }).then((workouts) => {
        res.setHeader("Content-Type", "application/json");
        res.status(200);
        res.json(workouts);
    });
});

// Update event
router.patch("/", async (req, res) => {
    
});


module.exports = router;
