const mongoose = require('mongoose');

const couponSchema = mongoose.Schema({
    code: {
        type: String,
        required: true
    },
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date,
        required: true
    },
    discount: {
        type: Number,
        required: true,
        default: 0
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true }
});

// check if coupon expired
couponSchema.virtual('isExpired').get(function () {
    return this.endDate < Date.now();
})

// setting daysLeft for coupon expiration
couponSchema.virtual('daysLeft').get(function () {
    const diffTime = this.endDate - Date.now();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + " Days left";
    return diffDays;
})

// check if endDate is less then startDate
couponSchema.pre("validate", function (next) {
    if (this.endDate <= this.startDate) {
        next(new Error("End Date must be greater than Start Date"));
    }
    next()
})

// check if startDate is less than today
couponSchema.pre("validate", function (next) {
    if (this.startDate < Date.now()) {
        next(new Error("Start Date must be greater than today"));
    }
    next()
})

// check if endDate is less than today
couponSchema.pre("validate", function (next) {
    if (this.endDate < Date.now()) {
        next(new Error("End Date must be greater than today"));
    }
    next()
})

// check for discount
couponSchema.pre("validate", function (next) {
    if (this.discount <= 0 || this.discount >= 100) {
        next(new Error("Discount must be in right proportion"));
    }
    next()
})

//

module.exports = mongoose.model('Coupon', couponSchema)