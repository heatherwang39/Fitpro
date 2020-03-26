/*
 * Routes for creating, retrieving, and modifying users
 */

const express = require("express");

const router = express.Router();
const User = require("../models/user");

// Register
router.post("/", async (req, res) => {
    const requiredInputs = ["email", "password", "username", "firstname", "lastname", "gender", "isTrainer"];
    const isValidOperation = requiredInputs.every((requiredInput) => req.body[requiredInput] !== undefined);
    if (!isValidOperation) {
        return res.status(400).send({ error: "missing required inputs!" });
    }

    const user = new User(req.body);
    const { password, ...resUser } = user._doc; // Don't include password in response
    try {
        await user.save();
        res.status(201).send(resUser);
    } catch (err) {
        console.log("error in /users POST", err);
        res.status(err.name === "ValidationError" ? 400 : 500).send();
    }
});

// find by id
router.get("/:id", async (req, res) => {
    if (!req.params || !req.params.id) {
        return res.status(400).send();
    }
    if (req.params.id.length !== 24) { // default length of _id
        return res.status(404).send();
    }
    try {
        const user = await User.findById(req.params.id).populate("trainers clients", "_id username firstname lastname");
        if (!user) {
            return res.status(404).send();
        }
        const { password, ...resUser } = user._doc; // Don't include password in response
        res.setHeader("Content-Type", "application/json");
        res.status(200);
        res.json(resUser);
    } catch (err) {
        console.log("error in /users GET", err);
        res.status(500).send();
    }
});

// Update by id
router.patch("/:id", async (req, res) => {
    if (!req.params || !req.params.id) {
        return res.status(400).send();
    }
    if (req.params.id.length !== 24) { // default length of _id
        return res.status(404).send();
    }

    const updates = Object.keys(req.body);
    const allowedUpdates = {
        email: true,
        password: true,
        username: true,
        firstname: true,
        lastname: true,
        gender: true,
        isTrainer: true,
        phone: true,
        height: true,
        weight: true,
        rating: true,
        price: true,
        goalType: true,
        imageUrl: true,
        trainers: true,
        clients: true,
    };

    const isValidOperation = updates.every((update) => allowedUpdates[update]);
    if (!isValidOperation) {
        return res.status(403).send({ error: "Invalid updates!" });
    }

    try {
        const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
        const { password, ...resUser } = user._doc;
        if (!user) {
            return res.status(404).send();
        }
        res.status(200).send(resUser);
    } catch (err) {
        res.status(400).send(err);
    }
});


module.exports = router;
