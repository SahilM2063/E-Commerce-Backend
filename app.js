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

// not found handler
app.use(notFound);
// global error handler
app.use(globalErrorHandler);

const PORT = process.env.PORT || 1823;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})
