const mongoose = require("mongoose");

const schema = mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        required: true,
    },
    description: String,
    equipment: String,
    level: String,
    benefits: [String],
    muscle: String,
    rating: Number,
    images: [String],
});

module.exports = mongoose.model("exercise", schema);
