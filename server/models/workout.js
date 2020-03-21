const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

// Returns most common element in l in O(n) or null if l is empty
const mode = (l) => {
    if (!l || !l.length) return null;
    const freq = {};
    let mostCommon = l[0];
    l.forEach((x) => {
        freq[x] = freq[x] ? 1 : freq[x] + 1;
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
    creator: {
        type: mongoose.ObjectId,
        ref: "user",
    },
    exercises: [
        {
            count: Number,
            countUnits: String,
            instructions: String,
            exercise: {
                type: mongoose.ObjectId,
                ref: "exercise",
            },
        },
    ],
    description: String,
    level: String,
    rating: Number,
    avgExerciseRating: Number,
});

schema.pre("save", function (next) { /* eslint-disable-line func-names */
    if (this.isNew || this.isModified("exercises")) {
        this.populate("exercises.exercise").execPopulate(() => {
            // console.log(this.exercises);
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

schema.plugin(mongoosePaginate);

module.exports = mongoose.model("workout", schema);
