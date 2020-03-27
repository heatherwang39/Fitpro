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

    const {
        title, description, client, start, end,
    } = req.body;
    const event = new Event({
        title,
        description,
        client,
        start,
        end,
        owner: req.user._id,
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
        Event.findOne({ _id: ObjectId(req.query.id) }).exec((err, event) => {
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
    const { minDate, maxDate, page } = req.query;
    Event.paginate({
        owner: req.user._id,
        datetime: {
            $lte: maxDate,
            $gte: minDate,
        },
    }, { page }).then((events) => {
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
        owner: userId,
    }, { page }).then((workouts) => {
        res.setHeader("Content-Type", "application/json");
        res.status(200);
        res.json(workouts);
    });
});

router.get("/mine", (req, res) => {
    if (!req.user) {
        res.status(401).send();
        return;
    }
    const { page } = req.query;
    Event.paginate({
        owner: req.user._id,
    }, { page }).then((workouts) => {
        res.setHeader("Content-Type", "application/json");
        res.status(200);
        res.json(workouts);
    });
});

router.get("/clients", (req, res) => {
    const { userId, page } = req.query;
    Event.paginate({
        client: userId,
    }, { page }).then((workouts) => {
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
        $or: [{ client: userId }, { owner: userId }],

    }, { populate: { path: "events.event", limit: 3 }, page }).then((workouts) => {
        res.setHeader("Content-Type", "application/json");
        res.status(200);
        res.json(workouts);
    });
});

// Update event
router.patch("/", async (req, res) => {
    if (!req.body) {
        res.status(400).send();
        return;
    }
    if (!req.user) {
        res.status(401).send();
        return;
    }
    const { id, ...changes } = req.body;
    let event;
    try {
        event = await Event.findOneAndUpdate({
            _id: id,
        }, changes, { new: true });
    } catch (e) {
        res.status(400).send();
    }
    res.json(event);
});


module.exports = router;
