/*
 * Route for searching trainers
 */

const express = require("express");

const router = express.Router();
const User = require("../models/user");


const rangeQuery = (min, max) => {
    if (!min) {
        if (!max) return undefined;
        return { $lte: max };
    }
    if (!max) {
        if (!min) return undefined;
        return { $gte: min };
    }
    return { $lte: max, $gte: min };
};

router.get("/", (req, res) => {
    const query = { isTrainer: true, searchable: true };
    if(req.query.gender) query.gender = req.query.gender
    if (req.query.firstname) query.firstname = {$regex: req.query.firstname, $options: "i"}
    const price = rangeQuery(req.query.minPrice, req.query.maxPrice);
    if (price) query.price = price;
    const rating = rangeQuery(req.query.minRating, req.query.maxRating);
    if (rating) query.rating = rating;
    
    User.paginate(query, { select: "_id username firstname lastname isTrainer rating gender phone height weight price goalType imageUrl clients trainers numRatings" }).then((trainers) => {
        res.setHeader("Content-Type", "application/json");
        res.status(200);
        res.json(trainers);
    }).catch((e) => {
        console.log("Error in GET /trainers:", e.toString());
        res.status(500).send();
    });
});

module.exports = router;
