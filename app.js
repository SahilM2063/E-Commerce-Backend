const express = require('express');
const cors = require('cors');
const { dbConnect } = require('./config/dbConnect');
const { default: userRoutes } = require('./routes/userRoutes');
const { default: productRoutes } = require('./routes/productRoutes');
const { default: categoryRoutes } = require('./routes/categoryRoutes');
const { default: brandRoutes } = require('./routes/brandRoutes');
const { default: colorRoutes } = require('./routes/colorRoutes');
const { default: reviewRoutes } = require('./routes/reviewRoutes');
const { default: orderRoutes } = require('./routes/orderRoutes');
const { default: couponRoutes } = require('./routes/coupenRoutes');
const Order = require('./models/Order');
const passport = require('passport');
require('dotenv').config();

const { globalErrorHandler, notFound } = require('./middlewares/globalErrorHandler');

// database connection function
dbConnect();

const app = express();

// cors for cross origin resource sharing
app.use(cors());

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);


// This is your Stripe CLI webhook secret for testing your endpoint locally.
const endpointSecret = process.env.WEBHOOK_ENDPOINT_SECRET;

app.post('/webhook', express.raw({ type: 'application/json' }), async (request, response) => {
    const sig = request.headers['stripe-signature'];

    let event;

    try {
        event = stripe.webhooks.constructEvent(request.body, sig, endpointSecret);
    } catch (err) {
        console.log("err", err.message)
        response.status(400).send(`Webhook Error: ${err.message}`);
        return;
    }

    // Handle the event
    // switch (event.type) {
    //     case 'payment_intent.succeeded':
    //         const paymentIntentSucceeded = event.data.object;
    //         // Then define and call a function to handle the event payment_intent.succeeded
    //         break;
    //     // ... handle other event types
    //     default:
    //         console.log(`Unhandled event type ${event.type}`);
    // }
    if (event.type === 'checkout.session.completed') {
        // update the order
        const session = event.data.object;
        const { orderId } = session.metadata;
        const paymentStatus = session.payment_status;
        const paymentMethod = session.payment_method_types[0];
        const totalAmount = session.amount_total;
        const currency = session.currency;

        // find the order
        const order = await Order.findByIdAndUpdate(JSON.parse(orderId), {
            totalPrice: totalAmount / 100,
            paymentStatus,
            paymentMethod,
            currency
        }, {
            new: true
        });
        console.log(order)
    } else {
        return;
    }

    // Return a 200 response to acknowledge receipt of the event
    response.send();
});

app.use(express.json());

// routes
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/products', productRoutes);
app.use('/api/v1/categories', categoryRoutes);
app.use('/api/v1/brands', brandRoutes);
app.use('/api/v1/colors', colorRoutes);
app.use('/api/v1/reviews', reviewRoutes);
app.use('/api/v1/orders', orderRoutes);
app.use('/api/v1/coupons', couponRoutes);

// not found handler
app.use(notFound);
// global error handler
app.use(globalErrorHandler);

const PORT = process.env.PORT || 1823;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})
