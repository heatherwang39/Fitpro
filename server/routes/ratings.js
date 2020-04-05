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
        console.log("invalid user");
        res.status(401).send();
        return;
    }
    if (!req.body || req.body.rating === undefined) {
        console.log("no body/rating");
        res.status(400).send();
        return;
    }
    let query = { user: ObjectID(req.user._id) };
    if (req.body.workout) {
        query = { ...query, workout: ObjectID(req.body.workout) };
    } else if (req.body.exercise) {
        query = { ...query, exercise: ObjectID(req.body.exercise) };
    } else if (req.body.trainer) {
        if (req.body.review) {
            query = { ...query, trainer: ObjectID(req.body.trainer), review: req.body.review };
        } else {
            query = { ...query, trainer: ObjectID(req.body.trainer) };
        }
    } else {
        res.status(400).send();
        return;
    }
    Rating.findOne(query, async (err, rating) => {
        if (err) {
            res.status(500).send();
            return;
        }
        if (rating) {
            const old = await Rating.findById(rating._id);
            old.rating = req.body.rating;
            old.save(() => res.status(200).send());
            return;
        }
        const newRating = new Rating({ ...query, rating: req.body.rating });
        newRating.save((e) => {
            if (e) {
                console.log(e);
                res.status(500).send();
            } else res.status(200).send();
        });
    });
});

router.delete("/", async (req, res) => {
    if (!req.user) {
        res.status(401).send();
        return;
    }
    if (!req.body) {
        res.status(400).send();
        return;
    }
    let query;
    if (req.body.exercise) {
        query = { user: ObjectID(req.user._id), exercise: ObjectID(req.body.exercise) };
    } else if (req.body.workout) {
        query = { user: ObjectID(req.user._id), workout: ObjectID(req.body.workout) };
    } else if (req.body.trainer) {
        query = { user: ObjectID(req.user._id), trainer: ObjectID(req.body.trainer) };
    } else {
        res.status(400).send();
        return;
    }
    const rating = await Rating.findOne(query);
    if (!rating) {
        res.status(400).send();
        return;
    }
    rating.remove((e) => res.status(e ? 500 : 200).send());
    // Rating.deleteOne(query, (e) => res.status(e ? 500 : 200).send());
});

// Returns 200 if user rated workout with id
router.get("/workout/:id", (req, res) => {
    if (!req.params || !req.params.id) {
        res.status(400).send();
        return;
    }
    if (!req.user) {
        res.status(401).send();
        return;
    }
    Rating.findOne({ user: ObjectID(req.user._id), workout: ObjectID(req.params.id) }, (err, rating) => {
        if (err) {
            res.status(500).send();
        } else if (rating) {
            res.status(200).send(rating.rating.toString());
        } else {
            res.status(400).send();
        }
    });
});

// Returns 200 if user rated exercise with id
router.get("/exercise/:id", (req, res) => {
    if (!req.params || !req.params.id) {
        res.status(400).send();
        return;
    }
    if (!req.user) {
        res.status(401).send();
        return;
    }
    Rating.findOne({ user: ObjectID(req.user._id), exercise: ObjectID(req.params.id) }, (err, rating) => {
        if (err) {
            res.status(500).send();
        } else if (rating || rating === 0) {
            res.status(200).send(rating);
        } else {
            res.status(400).send();
        }
    });
});

// Returns 200 if user rated trainer with id
router.get("/trainer/:id", (req, res) => {
    if (!req.params || !req.params.id) {
        res.status(400).send();
        return;
    }
    if (!req.user) {
        res.status(401).send();
        return;
    }
    if (req.user._id === req.params.id) {
        res.status(200).send();
        return;
    }
    Rating.findOne({ user: ObjectID(req.user._id), trainer: ObjectID(req.params.id) }, (err, rating) => {
        if (err) {
            res.status(500).send();
        } else if (rating || rating === 0) {
            res.status(200).send(rating);
        } else {
            res.status(400).send();
        }
    });
});

router.get("/user/:id", (req, res) => {
    if (!req.params || !req.params.id) {
        res.status(400).send();
        return;
    }
    if (!req.user) {
        res.status(401).send();
        return;
    }
    Rating.find({ trainer: ObjectID(req.params.id) }).populate("user").exec((err, ratings) => {
        if (err) {
            res.status(500).send();
        } else {
            res.status(200).send(ratings || []);
        }
    });
});

module.exports = router;
