/*
 * Routes for exercises
 */

const express = require("express");
const { ObjectID } = require("mongodb");

const router = express.Router();
const Exercise = require("../models/exercise");

// Get all exercises
router.get("/:name?/:group?", (req, res) => {
    // if (req.query.id) {
    //     // TODO
    //     res.status(500).send();
    // }
    // if (!req.query.name) {
    //     res.status(400).send();
    //     return;
    // }
    // const query = { name: new RegExp(req.query.name, "i") };
    // Exercise.paginate(query, { page: req.query.page ? req.query.page : 1 }).then((exercises) => {
    //     res.setHeader("Content-Type", "application/json");
    //     res.status(200);
    //     res.json(exercises);
    // }).catch((e) => {
    //     console.log("Error in GET /exercises:", e.toString());
    //     res.status(500).send();
    // });

    const name = req.query.name;
    const group = req.query.group;

    if (name) {
        Exercise.find({ name }).then((exercise) => {
            if (!exercise) {
                res.status(404).send();
            } else {
                res.send(exercise);
            }
        }).catch((error) => {
            res.status(505).send(error);
        });
    } else if (group) {
        Exercise.find({ muscle: group }).then((exercises) => {
            if (!exercises) {
                res.status(404).send();
            } else {
                res.send(exercises);
            }
        }).catch((error) => {
            res.status(505).send(error);
        });
    } else {
        Exercise.find().then((exercises) => {
            res.send(exercises);
        }, (error) => {
            res.status(500).send(error);
        });
    }
});

// Get exercise by id
router.get("/:id", (req, res) => {
    const id = req.params.id;

    if (!ObjectID.isValid(id)) {
        res.status(400).send();
    }

    Exercise.findById(id).then((exercise) => {
        if (!exercise) {
            res.status(404).send();
        } else {
            res.send(exercise);
        }
    }).catch((error) => {
        res.status(505).send(error);
    });
});

module.exports = router;
