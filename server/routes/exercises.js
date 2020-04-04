/*
 * Routes for exercises
 */

const express = require("express");

const router = express.Router();
const Exercise = require("../models/exercise");

router.get("/", (req, res) => {
    if (req.query.id) {
        // TODO
        res.status(500).send();
    }
    if (!req.query.name) {
        res.status(400).send();
        return;
    }
    const query = { name: new RegExp(req.query.name, "i") };
    Exercise.paginate(query, { page: req.query.page ? req.query.page : 1 }).then((exercises) => {
        res.setHeader("Content-Type", "application/json");
        res.status(200);
        res.json(exercises);
    }).catch((e) => {
        console.log("Error in GET /exercises:", e.toString());
        res.status(500).send();
    });
});

module.exports = router;
