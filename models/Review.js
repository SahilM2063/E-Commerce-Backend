const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Review must belong to a user']
    },
    comment:{
        type: String,
        required: [true, 'Please add a comment']
    },
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: [true, 'Review must belong to a product']
    },
    rating: {
        type: Number,
        required: [true, 'Please add a rating between 1 to 5'],
        min: 1,
        max: 5
    }
}, { timestamps: true });


module.exports = mongoose.model('Review', reviewSchema);