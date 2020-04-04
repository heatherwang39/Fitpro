const mongoose = require("mongoose");

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
        type: mongoose.ObjectID,
        ref: "workout",
    },
    exercise: {
        type: mongoose.ObjectID,
        ref: "exercise",
    },
    trainer: {
        type: mongoose.ObjectID,
        ref: "user",
    },
    review: String,
});

module.exports = mongoose.model("rating", schema);
