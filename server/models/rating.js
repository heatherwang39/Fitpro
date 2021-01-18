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

schema.pre("save", async function (next) { /* eslint-disable-line func-names */
    const old = await mongoose.models.rating.findById(this._id);
    if (this.isNew || this.isModified("rating")) {
        let doc;
        if (this.workout) doc = await Workout.findById(this.workout);
        else if (this.exercise) doc = await Exercise.findById(this.exercise);
        else doc = await User.findById(this.trainer);
        if (this.isNew) {
            doc.numRatings++;
            doc.rating += (this.rating - doc.rating) / doc.numRatings;
            doc.save((e) => {
                next();
            });
        } else {
            doc.rating = (doc.numRatings * doc.rating - old.rating + this.rating) / doc.numRatings;
            doc.save(() => next());
        }
    } else next();
});

schema.pre("remove", async function (next) { /* eslint-disable-line func-names */
    let doc;
    if (this.workout) doc = await Workout.findById(this.workout);
    else if (this.exercise) doc = await Exercise.findById(this.exercise);
    else doc = await User.findById(this.trainer);
    doc.rating = (doc.numRatings * doc.rating - this.rating) / (doc.numRatings - 1);
    doc.numRatings--;
    doc.save(() => next());
});

module.exports = mongoose.model("rating", schema);
