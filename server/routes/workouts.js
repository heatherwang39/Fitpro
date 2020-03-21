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
    const workout = new Workout(EDITABLE_WORKOUT_FIELDS.reduce((acc, cur) => ({ ...acc, [cur]: req.body[cur] }), {}));
    workout.creator = req.user._id;
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
            res.status(400).send();
            return;
        }
        Workout.findOne({ _id: ObjectId(req.query.id) }).populate("exercises.exercise").exec((err, workout) => {
            if (err) {
                console.log("Error in GET /workouts by id", err);
                res.status(500).send();
                return;
            }
            if (!workout) {
                res.status(404).send();
                return;
            }
            res.setHeader("Content-Type", "application/json");
            res.status(200);
            res.json(workout.populate());
        });
        return;
    }
    const { name, ...rest } = req.query;
    Workout.paginate({ name: { $regex: name, $options: "i" }, ...rest }).then((workouts) => {
        res.setHeader("Content-Type", "application/json");
        res.status(200);
        res.json(workouts);
    });
    // User
    //     .findOne({ _id: ObjectId(req.query.id) })
    //     .populate("trainers clients", "_id username firstname lastname")
    //     .exec((err, user) => {
    //         if (err) {
    //             console.log("error in /users GET", err);
    //             res.status(500).send();
    //             return;
    //         }
    //         if (!user) {
    //             res.status(404).send();
    //         }
    //         res.setHeader("Content-Type", "application/json");
    //         res.status(200);
    //         res.json(user.populate());
    //     });
});


module.exports = router;
