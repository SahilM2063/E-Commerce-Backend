const mongoose = require('mongoose');

// Generate Random Numbers for order
const randomTxt = Math.random().toString(36).substring(7).toLocaleUpperCase();
const randomNum = Math.floor(1000 + Math.random() * 90000);
// minor changes will be soon

const orderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    orderItems: [
        {
            type: Object,
            required: true
        }
    ],
    shippingAddress: {
        type: Object,
        required: true
    },
    orderNumber: {
        type: String,
        required: true,
        default: randomTxt + randomNum,
    },

    // for stripe payment

    paymentStatus: {
        type: String,
        default: 'Not Paid'
    },
    paymentMethod: {
        type: String,
        default: 'card'
    },
    totalPrice: {
        type: Number,
        default: 0.0
    },
    currency: {
        type: String,
        default: 'INR'
    },

    // for admin
    status: {
        type: String,
        default: 'Pending',
        enum: ['Pending', 'Delivered', 'Cancelled', 'Processing', 'Shipped']
    },
    deliveredAt: {
        type: Date
    },
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);