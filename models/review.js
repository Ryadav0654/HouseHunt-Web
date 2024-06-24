// require mongoose and schema
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// create the review schema
const reviewSchema = new Schema({
    comment: String,
    rating: {
        type: Number,
        min: 1,
        max: 5,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: "User"
    }
});

// create the review model
const Review = mongoose.model("Review", reviewSchema);

// export the review mondel for use
module.exports = Review