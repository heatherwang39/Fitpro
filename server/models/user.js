const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const saltRounds = 10;

const schema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    username: {
        type: String,
        required: true,
        unique: true,
    },
    trainers: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "user",
        },
    ],
    clients: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "user",
        },
    ],
    firstname: {
        type: String,
        required: true,
    },
    lastname: {
        type: String,
        required: true,
    },
    gender: {
        type: String,
        required: true,
    },
    isTrainer: {
        type: Boolean,
        required: true,
    },
    phone: String,
    height: Number,
    weight: Number,
    rating: Number,
    price: Number,
    goalType: String,
    imageUrl: String,
    token: String,
});

schema.pre("save", function (next) { /* eslint-disable-line func-names */
    if (this.isNew || this.isModified("password")) {
        const user = this;
        bcrypt.hash(user.password, saltRounds, (err, hashedPassword) => {
            if (err) next(err);
            else {
                user.password = hashedPassword;
                next();
            }
        });
    } else next();
    // TODO update correspoding clients/trainers if trainers/clients changed
});

module.exports = mongoose.model("user", schema);
