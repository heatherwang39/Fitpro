const mongoose = require("mongoose");

// Returns most common element in l in O(n) or null if l is empty
const mode = (l) => {
    if (!l || !l.length) return null;
    const freq = {};
    let mostCommon = l[0];
    l.forEach((x) => {
        freq[x] = freq[x] ? freq[x] + 1 : 1;
        if (freq[x] > freq[mostCommon]) {
            mostCommon = x;
        }
    });
    return mostCommon;
};

const schema = mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    owner: {
        type: mongoose.ObjectId,
        ref: "user",
    },
    exercises: [
        {
            instructions: String,
            exercise: {
                type: mongoose.ObjectId,
                ref: "exercise",
            },
        },
    ],
    description: String,
    level: String,
    rating: {
        type: Number,
        default: 0,
    },
    numRatings: {
        type: Number,
        default: 0,
    },
    avgExerciseRating: Number,
    numExercises: Number,
});

schema.pre("save", function (next) { /* eslint-disable-line func-names */
    if (this.isNew || this.isModified("exercises")) {
        this.numExercises = this.exercises.length;
        this.populate("exercises.exercise").execPopulate(() => {
            this.level = mode(this.exercises.reduce(
                (acc, cur) => (cur.exercise.level ? acc.concat([cur.exercise.level]) : acc), [],
            ));
            const sum = this.exercises.reduce(
                (acc, cur) => (
                    typeof cur.exercise.rating === "number" ? [acc[0] + 1, acc[1] + cur.exercise.rating] : acc), [0, 0],
            );
            this.avgExerciseRating = sum[0] === 0 ? null : (sum[1] / sum[0]).toPrecision(2);
            next();
        });
    } else next();
});

module.exports = mongoose.model("workout", schema);
