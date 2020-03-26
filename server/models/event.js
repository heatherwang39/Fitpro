const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

const schema = mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    ownerId: {
        type: mongoose.ObjectId,
        ref: "user",
    },
    description: String,
    clientId: {
        type: mongoose.ObjectId,
        ref: "user",
    },
    datetime: Number,
});

schema.plugin(mongoosePaginate);

module.exports = mongoose.model("event", schema);
