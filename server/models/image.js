const mongoose = require('mongoose');

// create an image schema
const imageSchema = mongoose.Schema({
    image_id: {
        type: String,
        required: true
    },
    image_url: {
        type: String,
        required: true
    },
    created_at: String
});

// create an image model using the schema
const Image = mongoose.model('Image', imageSchema);

module.exports = { Image };