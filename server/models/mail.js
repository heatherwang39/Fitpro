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
    },
    sentDate: Number,
    receiver: {
        type: mongoose.ObjectId,
        ref: "user",
    },
    content: {
        type: String,
        required: true,
    },
});

schema.plugin(mongoosePaginate);

module.exports = mongoose.model("mail", schema);
