/*
 *
 * Middleware for authenticating requests
 *
 * cookie-parser is expected to have been run before this
 *
 */

const jwt = require("jsonwebtoken");
const ObjectId = require("mongodb").ObjectID;
const secret = require("./keys/jwtsecret");
const User = require("./models/user");

// Send status of unauthorized and clear the token
// Body is msg or "Session expired" if msg isn't supplied
const sessionExpired = (res, msg) => {
    res.status(401);
    res.clearCookie("token");
    res.send(msg === undefined ? "Session expired" : msg);
};

const auth = (req, res, next) => {
    if (!req.cookies.token) {
        req.user = null;
        next();
        return;
    }
    const { id } = jwt.decode(req.cookies.token); // Get UserID without verifying signature
    // Need to find the correct user before verifying JWT since we sign with secret + password
    User.findOne({ _id: ObjectId(id) }, (err, user) => {
        if (err || !user) {
            sessionExpired(res);
            return;
        }
        // Actually verify the token
        let payload = null;
        try {
            payload = jwt.verify(req.cookies.token, secret + user.password);
        } catch (e) {
            sessionExpired(res);
            return;
        }
        // Require reauthentication after 24 hours if not Remember Me
        if (!payload.remember && (Date.now() / 1000 - payload.tokenIssued) > 86400) {
            sessionExpired(res);
            return;
        }
        // Renew token for an hour if it expires in < 15 mins
        if (payload.exp - Date.now() / 1000 < 900) { // should always be false if payload.remember
            delete payload.iat;
            delete payload.exp;
            delete payload.nbf;
            delete payload.jti;
            const token = jwt.sign(payload, secret + user.password, { expiresIn: "1h" });
            res.cookie("token", token, { expires: Date.now() + 3.6e6, httpOnly: true, secure: true });
        }
        req.user = {
            id: payload._id,
            username: payload.username,
            firstname: payload.firstname,
            lastname: payload.lastname,
            isTrainer: payload.isTrainer,
        };
        next();
    });
};

module.exports = auth;