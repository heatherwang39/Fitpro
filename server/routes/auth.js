/*
 * Routes for logging in and validating JWT
 */

const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const ObjectId = require("mongodb").ObjectID;
const jwtSecret = require("../keys/jwtsecret");

const router = express.Router();
const User = require("../models/user");

// Login
router.post("/login", (req, res) => {
    if (!req.body || req.body.username === undefined || req.body.password === undefined) {
        res.status(400).send();
        return;
    }
    const { username, password } = req.body;
    User.findOne({ username }, (err, user) => {
        if (err) {
            console.log(`Error trying to log in ${username}: ${err.toString()}`);
            res.status(500).send();
            return;
        }
        if (!user) {
            res.status(401).send();
            console.log(`Tried to log in as nonexistent user ${req.body.username}`);
            return;
        }
        bcrypt.compare(password, user.password, (e, same) => {
            if (e) {
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
                isTrainer: user.isTrainer,
                tokenIssued: Date.now() / 1000,
                remember: !!req.body.remember,
            };
            const token = jwt.sign(resUser,
                jwtSecret + user.password,
                resUser.remember ? undefined : { expiresIn: "1h" });

            user.tokens.push(token);
            user.save();

            res.cookie("token", token, {
                // 2147483647000 = epoch + 2^31 - 1 (Jan 2038)
                expires: new Date(resUser.remember ? 2147483647000 : Date.now() + 3.6e6),
                httpOnly: true,
                secure: true,
            });
            res.setHeader("Content-Type", "application/json");
            res.status(200);
            res.json(resUser);
            res.send();
        });
    });
});

// Returns 200 if token is valid
// Requires auth middleware to have already run to populate req.user
router.get("/validate", (req, res) => res.status(req.user ? 200 : 401).send());

// Delete the token from cookies and user
// 400 if token is invalid else 200
router.get("/logout", (req, res) => {
    if (!req.cookies || !req.cookies.token) {
        res.status(200).send();
        return;
    }
    const { id } = jwt.decode(req.cookies.token); // Get UserID without verifying signature
    User.findOne({ _id: ObjectId(id) }, (err, user) => {
        res.status(err || !user ? 400 : 200);
        user.tokens.pull(req.cookies.token);
        res.clearCookie("token");
        res.send();
    });
});

module.exports = router;
