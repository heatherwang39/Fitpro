/*
 * Route for searching trainers
 */

const express = require("express");

const router = express.Router();
const User = require("../models/user");

// Valid query attributes for searching with that can be queried directly on the db
const DB_SEARCH_PARAMS = ["gender"];

const rangeQuery = (min, max) => {
    if (!min) {
        if (!max) return undefined;
        return { $gt: max };
    }
    if (!max) {
        if (!min) return undefined;
        return { $gt: min };
    }
    return { $lt: max, $gt: min };
};

router.get("/", (req, res) => {
    const query = { isTrainer: true, searchable: true };
    DB_SEARCH_PARAMS.forEach((p) => {
        if (req.query[p]) query[p] = req.query[p];
    });
    const price = rangeQuery(req.query.minPrice, req.query.maxPrice);
    if (price) query.price = price;
    const rating = rangeQuery(req.query.minRating, req.query.maxRating);
    if (rating) query.rating = rating;
    User.paginate(query, { select: "_id username firstname lastname isTrainer rating gender phone height weight price goalType imageUrl clients trainers" }).then((trainers) => {
        res.setHeader("Content-Type", "application/json");
        res.status(200);
        res.json(trainers);
    }).catch((e) => {
        console.log("Error in GET /trainers:", e.toString());
        res.status(500).send();
    });
});

module.exports = router;
