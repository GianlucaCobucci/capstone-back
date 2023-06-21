const mongoose = require("mongoose")

const PostSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        max: 500,
    },
    img: {
        type: String,
    },
    likes: {
        type: Array,
        default: [],
    },
}, { timestamps: true, strict: true }
);

module.exports = mongoose.model("Post", PostSchema, "posts")