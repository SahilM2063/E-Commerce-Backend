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

// virtual populate for averageRating
productSchema.virtual("averageRating").get(function () {
    let totalRating = 0;
    const product = this;
    product?.reviews?.forEach((review) => {
        totalRating += review?.rating;
    })

    return Number(totalRating / product?.totalReviews).toFixed(1);
})


module.exports = mongoose.model('Product', productSchema);