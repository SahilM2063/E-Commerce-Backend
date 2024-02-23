const Order = require('../models/Order');
const User = require('../models/User');
const Product = require('../models/Product');
const asyncHandler = require('express-async-handler');


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
            product.totalSold += order.totalQtyBuying;
        }
        await product.save()
    });

    // push order to user
    userFound.orders.push(order?._id);
    await userFound.save()

    res.status(201).json({
        status: "success",
        message: "Order Created",
        order,
        userFound
    })

})

module.exports = { createOrder }