const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

const schema = mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    owner: {
        type: mongoose.ObjectId,
        ref: "user",
        required: true,
    },
    start: {
        type: Date,
        required: true,
    },
    end: {
        type: Date,
        required: true,
    },
    description: String,
    client: {
        type: mongoose.ObjectId,
        ref: "user",
    },
    workouts: [
        {
            type: mongoose.ObjectId,
            ref: "workout",
        },
    ],
});

schema.plugin(mongoosePaginate);

schema.pre("save", function (next) { /* eslint-disable-line func-names */
    if (this.isNew || this.isModified("client")) {
        if (this.client === this.owner) {
            this.client = null;
        }
        next();
    } else next();
    // TODO update correspoding clients/trainers if trainers/clients changed
});
module.exports = mongoose.model("event", schema);
