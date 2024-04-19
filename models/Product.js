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

// virtual populate for totalQty
productSchema.virtual('qtyLeft').get(function () {
    const product = this
    return Math.max(0, product.totalQty - product.totalSold);
})

// virtual populate for totalReviews
productSchema.virtual("totalReviews").get(function () {
    const product = this
    return product?.reviews?.length;
})

// virtual populate for averageRating for each product
productSchema.virtual("averageRating").get(function () {
    const product = this;
    const totalReviews = product.reviews.length;

    if (totalReviews === 0) {
        return 0;
    }

    let totalRating = 0;
    product.reviews.forEach((review) => {
        if (typeof review.rating === 'number') {
            totalRating += review.rating;
        }
    });

    return parseFloat((totalRating / totalReviews).toFixed(1));
});

module.exports = mongoose.model('Product', productSchema);