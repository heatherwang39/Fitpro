const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

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
    rating: {
        type: Number,
        default: 0,
    },
    images: [String],
});

schema.plugin(mongoosePaginate);

module.exports = mongoose.model("exercise", schema);
