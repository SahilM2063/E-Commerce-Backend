const mongoose = require('mongoose');

const colorSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    // products: [
    //     {
    //         type: mongoose.Schema.Types.ObjectId,
    //         ref: 'Product',
    //         required: true,
    //     }
    // ]
}, { timestamps: true });

module.exports = mongoose.model('Color', colorSchema);