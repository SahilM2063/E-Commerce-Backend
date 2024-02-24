const express = require('express');
const { dbConnect } = require('./config/dbConnect');
const { default: userRoutes } = require('./routes/userRoutes');
const { default: productRoutes } = require('./routes/productRoutes');
const { default: categoryRoutes } = require('./routes/categoryRoutes');
const { default: brandRoutes } = require('./routes/brandRoutes');
const { default: colorRoutes } = require('./routes/colorRoutes');
const { default: reviewRoutes } = require('./routes/reviewRoutes');
const { default: orderRoutes } = require('./routes/orderRoutes');
require('dotenv').config();
const { globalErrorHandler, notFound } = require('./middlewares/globalErrorHandler');


// database connection function
dbConnect();

const app = express();

app.use(express.json());

// routes
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/products', productRoutes);
app.use('/api/v1/categories', categoryRoutes);
app.use('/api/v1/brands', brandRoutes);
app.use('/api/v1/colors', colorRoutes);
app.use('/api/v1/reviews', reviewRoutes);
app.use('/api/v1/orders', orderRoutes);


const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);


// This is your Stripe CLI webhook secret for testing your endpoint locally.
const endpointSecret = process.env.WEBHOOK_ENDPOINT_SECRET;

app.post('/webhook', express.raw({ type: 'application/json' }), (request, response) => {
    const sig = request.headers['stripe-signature'];

    let event;

    try {
        event = stripe.webhooks.constructEvent(request.body, sig, endpointSecret);
    } catch (err) {
        response.status(400).send(`Webhook Error: ${err.message}`);
        return;
    }

    // Handle the event
    switch (event.type) {
        case 'payment_intent.succeeded':
            const paymentIntentSucceeded = event.data.object;
            // Then define and call a function to handle the event payment_intent.succeeded
            break;
        // ... handle other event types
        default:
            console.log(`Unhandled event type ${event.type}`);
    }

    // Return a 200 response to acknowledge receipt of the event
    response.send();
});


// not found handler
app.use(notFound);
// global error handler
app.use(globalErrorHandler);

const PORT = process.env.PORT || 1823;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})
