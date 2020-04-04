const mongoose = require("mongoose");
const Exercise = require("../models/exercise");
const Workout = require("../models/workout");
const User = require("../models/user");

const schema = mongoose.Schema({
    user: {
        type: mongoose.ObjectId,
        ref: "user",
        required: true,
    },
    rating: { // Rating out of 10
        type: Number,
        required: true,
    },
    workout: {
        type: mongoose.ObjectId,
        ref: "workout",
    },
    exercise: {
        type: mongoose.ObjectId,
        ref: "exercise",
    },
    trainer: {
        type: mongoose.ObjectId,
        ref: "user",
    },
    review: String,
});

schema.pre("save", function (next) { /* eslint-disable-line func-names */
    if (this.isNew || this.isModified("rating")) {
        // TODO update average rating
    }
    next();
});

schema.pre("remove", function (next) { /* eslint-disable-line func-names */
    // TODO update average rating
    (() => {})(this);
    next();
});

module.exports = mongoose.model("rating", schema);
