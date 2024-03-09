const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    orders: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Order'
        }
    ],
    wishList: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'wishList'
        }
    ],
    isAdmin: {
        type: Boolean,
        default: false
    },
    hasShippingAddress: {
        type: Boolean,
        default: false
    },
    shippingAddress: {
        firstName: {
            type: String,
        },
        lastName: {
            type: String,
        },
        address: {
            type: String,
        },
        city: {
            type: String,
        },
        postalCode: {
            type: String,
        },
        province: {
            type: String,
        },
        country: {
            type: String,
        },
        phoneNumber: {
            type: String,
        }
    }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);