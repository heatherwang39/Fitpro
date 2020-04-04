/*
 * Routes for liking exercises/workouts
 */

const express = require("express");

const router = express.Router();
const ObjectID = require("mongodb").ObjectID;
require("../models/exercise");
require("../models/workout");
require("../models/user");
const Rating = require("../models/rating");

// Create
router.post("/", (req, res) => {
    if (!req.user) {
        res.status(401).send();
        return;
    }
    if (!req.query.rating) {
        res.status(400).send();
        return;
    }
    let query = { user: ObjectID(req.user._id), rating: req.query.rating };
    if (req.query.workout) {
        query = { ...query, workout: ObjectID(req.query.workout) };
    } else if (req.query.exercise) {
        query = { ...query, exercise: ObjectID(req.query.exercise) };
    } else if (req.query.trainer) {
        query = { ...query, trainer: ObjectID(req.query.trainer) };
    } else {
        res.status(400).send();
        return;
    }
    Rating.findOne(query, (err, rating) => {
        if (err) {
            res.status(500).send();
            return;
        }
        if (rating) {
            rating = { ...rating, ...query };
            rating.save();
            res.status(200).send();
            return;
        }
        const newRating = new Rating(query);
        newRating.save((e) => {
            res.status(e ? 500 : 200).send();
        });
    });
});

// Returns 200 if user rated workout with id
router.get("/workout/:id", (req, res) => {
    if (!req.query || !req.query.id) {
        res.status(400).send();
        return;
    }
    if (!req.user) {
        res.status(401).send();
        return;
    }
    Rating.findOne({ user: ObjectID(req.user._id), workout: ObjectID(req.query.id) }, (err, like) => {
        if (err) {
            res.status(500).send();
        } else if (like) {
            res.status(200).send();
        } else {
            res.status(400).send();
        }
    });
});

// Returns 200 if user rated exercise with id
router.get("/exercise/:id", (req, res) => {
    if (!req.query || !req.query.id) {
        res.status(400).send();
        return;
    }
    if (!req.user) {
        res.status(401).send();
        return;
    }
    Rating.findOne({ user: ObjectID(req.user._id), exercise: ObjectID(req.query.id) }, (err, like) => {
        if (err) {
            res.status(500).send();
        } else if (like) {
            res.status(200).send();
        } else {
            res.status(400).send();
        }
    });
});

// Returns 200 if user rated trainer with id
router.get("/trainer/:id", (req, res) => {
    if (!req.query || !req.query.id) {
        res.status(400).send();
        return;
    }
    if (!req.user) {
        res.status(401).send();
        return;
    }
    Rating.findOne({ user: ObjectID(req.user._id), trainer: ObjectID(req.query.id) }, (err, like) => {
        if (err) {
            res.status(500).send();
        } else if (like) {
            res.status(200).send();
        } else {
            res.status(400).send();
        }
    });
});

module.exports = router;
