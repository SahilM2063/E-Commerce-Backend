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

    // convert the orderItems to have same structure as stripe needed
    const convertedOrders = orderItems?.map((item) => {
        return {
            price_data: {
                currency: 'inr',
                product_data: {
                    name: item?.name,
                    description: item?.description
                },
                unit_amount: item?.price * 100,
            },
            quantity: item?.qty,
        }
    })
    // Make stripe payment
    const session = await stripe.checkout.sessions.create({
        line_items: convertedOrders,
        metadata: {
            orderId: JSON.stringify(order?._id),
        },
        payment_method_types: ['card',],
        mode: 'payment',
        success_url: `http://localhost:3000/success`,
        cancel_url: `http://localhost:3000/cancel`
    })

    res.send({ url: session.url })
})

// @desc : Get ALl Orders
// @route : GET /api/v1/orders/getAll
// @access : Private/Admin

const getAllOrders = asyncHandler(async (req, res) => {
    const orders = await Order.find()
    res.status(200).json({
        status: "success",
        message: "All Orders Fetched",
        orders
    })
})

// @desc : Get Single Order
// @route : GET /api/v1/orders/:id
// @access : Private/Admin

const getSingleOrder = asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id);
    res.status(200).json({
        status: "success",
        message: "Single Order Fetched",
        order
    })
})

// @desc : Update Order
// @route : PUT /api/v1/orders/update/:id
// @access : Private/Admin

const updateOrder = asyncHandler(async (req, res) => {
    const order = await Order.findByIdAndUpdate(req.params.id, {
        status: req.body.status,
    }, { new: true });

    res.status(200).json({
        status: "success",
        message: "Order updated successfully",
        order
    })
})

module.exports = { createOrder, getAllOrders, getSingleOrder, updateOrder }



// For Indian Payment we have VISA card Number
// 4000 0035 6000 0008