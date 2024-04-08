const Order = require('../models/Order');
const User = require('../models/User');
const Product = require('../models/Product');
const Coupon = require('../models/Coupon');
const asyncHandler = require('express-async-handler');
const Stripe = require('stripe');
const dotenv = require('dotenv').config();

// Stripe Initialization
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

const createOrder = asyncHandler(async (req, res) => {
    const { orderItems, shippingAddress, totalValue } = req.body;

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
        totalPrice: totalValue
    })
    // console.log(order)

    // save the order in User model
    userFound.orders.push(order?._id);
    await userFound.save();

    const productIds = orderItems.map(item => item.productId._id);
    const products = await Product.find({ _id: { $in: productIds } })


    orderItems.forEach(async (orderItem) => {
        const product = products.find(product => product._id.toString() === orderItem.productId._id.toString());
        if (product) {
            product.totalSold += orderItem.quantity;
            await product.save();
        }
    });

    // // convert the orderItems to have same structure as stripe needed
    // const convertedOrders = orderItems.map(item => {
    //     return {
    //         price_data: {
    //             currency: 'inr',
    //             product_data: {
    //                 name: item.productId.name,
    //                 description: item.productId.description
    //             },
    //             unit_amount: item.price * 100,
    //         },
    //         quantity: item.quantity,
    //     };
    // });

    // Make stripe payment
    const session = await stripe.checkout.sessions.create({
        line_items: [
            {
                price_data: {
                    currency: 'inr',
                    product_data: {
                        name: 'Order Total',
                        description: 'Total payment for the order'
                    },
                    unit_amount: totalValue * 100,
                },
                quantity: 1,
            },
        ],
        metadata: {
            orderId: JSON.stringify(order?._id),
        },
        payment_method_types: ['card'],
        mode: 'payment',
        success_url: `http://localhost:5173/user/payment/success`,
        cancel_url: `http://localhost:5173/user/payment/failed`
    })

    res.send({ url: session.url })
})

// @desc : Get ALl Orders
// @route : GET /api/v1/orders/getAll
// @access : Private/Admin

const getAllOrders = asyncHandler(async (req, res) => {
    const orders = await Order.find().populate({
        path: 'user',
        model: 'User'
    });
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

// @desc : Get Total Sales 
// @route : GET /api/v1/orders/sales/sum
// @access : Private/Admin

const getOrderStats = asyncHandler(async (req, res) => {
    // Order stats
    const orderStats = await Order.aggregate([
        {
            $group: {
                _id: null,
                sumOfSales: {
                    $sum: '$totalPrice'
                },
                minOrder: {
                    $min: '$totalPrice'
                },
                maxOrder: {
                    $max: '$totalPrice'
                },
                averageOrder: {
                    $avg: '$totalPrice'
                }
            }
        }
    ]);

    // get the date 
    const date = new Date();
    const today = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    const todaySales = await Order.aggregate([
        {
            $match: {
                createdAt: {
                    $gte: today
                }
            }
        },
        {
            $group: {
                _id: null,
                sumOfSales: {
                    $sum: '$totalPrice'
                }
            }
        }
    ])



    res.status(200).json({
        status: "success",
        message: "Order Stats Successfully",
        orderStats, todaySales
    })
})

module.exports = { createOrder, getAllOrders, getSingleOrder, updateOrder, getOrderStats }



// For Indian Payment we have VISA card Number
// 4000 0035 6000 0008