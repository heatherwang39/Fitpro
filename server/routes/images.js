/*
 * Routes for creating, retrieving, and deleting profile images
 */

const express = require("express");

const router = express.Router();

// multipart middleware: access uploaded file from req.file
const multipart = require("connect-multiparty");

const multipartMiddleware = multipart();

// cloudinary: configure using credentials on Cloudinary Dashboard
const cloudinary = require("cloudinary");
const { Image } = require("../models/image");

cloudinary.config({
    cloud_name: "fitpro",
    api_key: "789846423899437",
    api_secret: "CZUz0umiRBwpR_gmTqcdaQksYvQ",
});


// a POST route to *create* an image
router.post("/", multipartMiddleware, (req, res) => {
    // Use uploader.upload API to upload image to cloudinary server.
    cloudinary.uploader.upload(
        req.files.image.path, // req.files contains uploaded files
        (result) => {
            // Create a new image using the Image mongoose model
            const img = new Image({
                image_id: result.public_id, // image id on cloudinary server
                image_url: result.url, // image url on cloudinary server
                created_at: new Date(),
            });

            // Save image to the database
            img.save().then(
                () => {
                    res.status(200).send(img.image_url);
                },
                (error) => {
                    res.status(400).send(error); // 400 for bad request
                },
            );
        },
    );
});

// a GET route to get all images
router.get("/", (req, res) => {
    Image.find().then(
        (images) => {
            res.send({ images }); // can wrap in object if want to add more properties
        },
        (error) => {
            res.status(500).send(error); // server error
        },
    );
});

// / a DELETE route to remove an image by its id.
router.delete("/:imageId", (req, res) => {
    const imageId = req.params.imageId;

    // Delete an image by its id (NOT the database ID, but its id on the cloudinary server)
    // on the cloudinary server
    cloudinary.uploader.destroy(imageId, (result) => {
        // Delete the image from the database
        Image.findOneAndRemove({ image_id: imageId })
            .then((img) => {
                if (!img) {
                    res.status(404).send();
                } else {
                    res.send(img);
                }
            })
            .catch((error) => {
                res.status(500).send(); // server error, could not delete.
            });
    });
});

module.exports = router;
