/*
 * Routes for logging in and getting/updating JWTs
 */

const express = require("express");
const jwt = require("jsonwebtoken");
const jwtSecret = require("../keys/jwtsecret");

const router = express.Router();
const bcrypt = require("bcrypt");
const User = require("../models/user");

// Login
router.post("/", (req, res) => {
    if (!req.body || req.body.username === undefined || req.body.password === undefined) {
        res.status(400).send();
        return;
    }
    const { username, password } = req.body;
    User.findOne({ username }, (err, user) => {
        if (err) {
            res.status(500).send();
            return;
        }
        if (!user) {
            res.status(401).send();
            console.log(`Tried to log in as nonexistent user ${req.body.username}`);
            return;
        }
        bcrypt.compare(password, user.password, (err, same) => {
            if (err) {
                res.status(500).send();
                return;
            }
            if (!same) {
                res.sendStatus(401);
                return;
            }
            // Issue token
            const resUser = {
                email: user.email,
                id: user._id,
                firstname: user.firstname,
                lastname: user.lastname,
                username: user.username,
            };
            const token = jwt.sign(resUser, jwtSecret, { expiresIn: "1h" });
            res.cookie("token", token, { expires: new Date(Date.now() + 3.6e6), httpOnly: true, secure: true });
            res.setHeader("Content-Type", "application/json");
            res.status(200);
            res.json(resUser);
            res.send();
        });
    });
});

// TODO route for validating JWT
// TODO route for refreshing JWT

module.exports = router;
