const Order = require('../models/Order');
const User = require('../models/User');
const Product = require('../models/Product');
const asyncHandler = require('express-async-handler');
const Stripe = require('stripe');
const dotenv = require('dotenv').config();

// Stripe Initialization
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

const createOrder = asyncHandler(async (req, res) => {
    const { orderItems, shippingAddress, totalPrice } = req.body;

    // find the user
    const userFound = await User.findById(req.userAuthId);

    // check if user has shipping Address
    if (!userFound?.hasShippingAddress) {
        throw new Error("Please provide shipping address")
    }

    // check if order is not empty
    if (orderItems?.length <= 0) {
        throw new Error('No order items found')
    }

    // Place / create order - save in DB
    const order = await Order.create({
        user: userFound?._id,
        orderItems,
        shippingAddress,
        totalPrice,
    })

    // save the order in User model
    userFound.orders.push(order?._id);
    await userFound.save();

    const products = await Product.find({ _id: { $in: orderItems } })

    orderItems?.map(async (order) => {
        const product = products?.find((product) => {
            return product?._id.toString() === order?._id.toString();
        });
        if (product) {
            product.totalSold += order.qty;
        }
        await product.save()
    });

    // push order to user
    userFound.orders.push(order?._id);
    await userFound.save()

    // Make stripe payment
    const session = await stripe.checkout.sessions.create({
        line_items: [{
            price_data: {
                currency: 'inr',
                product_data: {
                    name: "Hats",
                    description: "A Best Hat"
                },
                unit_amount: 10 * 100,
            },
            quantity: 3,
        }],
        payment_method_types: ['card',],
        mode: 'payment',
        success_url: `http://localhost:3000/success`,
        cancel_url: `http://localhost:3000/cancel`
    })

    res.send({ url: session.url })

    // res.status(201).json({
    //     status: "success",
    //     message: "Order Created",
    //     order,
    //     userFound
    // })

})

module.exports = { createOrder }



// For Indian Payment we have VISA card Number
// 4000 0035 6000 0008