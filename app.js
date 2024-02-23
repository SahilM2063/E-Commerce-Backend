const express = require('express');
const { dbConnect } = require('./config/dbConnect');
const { default: userRoutes } = require('./routes/userRoutes');
const { default: productRoutes } = require('./routes/productRoute');
const { default: categoryRoutes } = require('./routes/categoryRoute');
const { default: brandRoutes } = require('./routes/brandRoute');
const { default: colorRoutes } = require('./routes/colorRoutes');
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

// not found handler
app.use(notFound);
// global error handler
app.use(globalErrorHandler);

const PORT = process.env.PORT || 1823;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})
