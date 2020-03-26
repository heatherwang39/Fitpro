/*
 * Routes for creating, retrieving, and modifying users
 */

const express = require("express");

const router = express.Router();
const ObjectId = require("mongodb").ObjectID;
require("../models/exercise");
const Workout = require("../models/workout");

const EDITABLE_WORKOUT_FIELDS = ["name", "exercises", "description"];

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
    const workout = new Workout({
        creator: req.user._id,
        // Copy editable workout fields from req.body
        ...EDITABLE_WORKOUT_FIELDS.reduce((acc, cur) => ({ ...acc, [cur]: req.body[cur] }), {}),
    });
    workout.save((err) => {
        if (err) {
            console.log("error in POST /workouts", err);
            res.status(err.name === "ValidationError" ? 400 : 500).send();
            return;
        }
        workout.populate("exercises.exercise").execPopulate().then(
            () => res.status(201).send(workout),
        );
    });
});

// Get
router.get("/", (req, res) => {
    if (!req.query) {
        res.status(400).send();
        return;
    }
    if (req.query.id) {
        if (req.query.id.length !== 24) { // default length of _id
            res.status(400).send("Invalid ID");
            return;
        }
        Workout.findOne({ _id: ObjectId(req.query.id) }).populate("exercises.exercise").exec((err, workout) => {
            if (err) {
                console.log("Error in GET /workouts by id", err);
                res.status(500).send();
                return;
            }
            if (!workout) {
                res.status(404).send("No workout with that ID");
                return;
            }
            res.setHeader("Content-Type", "application/json");
            res.status(200);
            res.json(workout.populate());
        });
        return;
    }
    if (req.query) {
        if (req.query.mine) {
            delete req.query.mine;
            if (!req.user) {
                res.status(400).send();
                return;
            }
            req.query.creator = req.user._id;
        }
        if (req.query.name !== undefined) {
            req.query.name = { $regex: req.query.name, $options: "i" };
        }
    }
    Workout.paginate(req.query, { populate: { path: "exercises.exercise", limit: 3 } }).then((workouts) => {
        res.setHeader("Content-Type", "application/json");
        res.status(200);
        res.json(workouts);
    });
});

// Update workout
router.patch("/", async (req, res) => {
    if (!req.body) {
        res.status(400).send();
        return;
    }
    if (!req.user) {
        console.log("no user");
        res.status(401).send();
        return;
    }
    const updated = { name: req.body.name, description: req.body.description };
    if (req.body.exercises && req.body.exercises.map) {
        updated.exercises = req.body.exercises.map((e) => ObjectId(e));
    }
    let workout;
    try {
        workout = await Workout.findOneAndUpdate({
            _id: ObjectId(req.body._id),
            creator: ObjectId(req.user._id),
        }, updated, { new: true });
    } catch (e) {
        console.log(e);
        res.status(400).send();
    }
    console.log(workout);
    res.status(200).json(workout);
});


module.exports = router;
