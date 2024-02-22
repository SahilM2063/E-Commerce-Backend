const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    brand: {
        type: String,
        required: true
    },
    category: {
        type: String,
        ref: 'Category',
        required: true
    },
    sizes: {
        type: [String],
        enum: ['S', 'M', 'L', 'XL', 'XXL'],
        required: true
    },
    colors: {
        type: [String],
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    images: [
        {
            type: String,
            default: "http://via.placeholder.com/150"
        }
    ],
    reviews: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Review'
        }
    ],
    price: {
        type: Number,
        required: true
    },
    totalQty: {
        type: Number,
        required: true,
    },
    totalSold: {
        type: Number,
        required: true,
        default: 0
    }
}, { timestamps: true, toJSON: { virtuals: true } });

module.exports = mongoose.model('Product', productSchema);