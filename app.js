const express = require('express');
const { dbConnect } = require('./config/dbConnect');
const { default: userRoutes } = require('./routes/userRoutes');
require('dotenv').config();
const { globalErrorHandler, notFound } = require('./middlewares/globalErrorHandler');


// database connection function
dbConnect();

const app = express();

app.use(express.json());

// routes
app.use('/api/v1/users', userRoutes);

// not found handler
app.use(notFound);
// global error handler
app.use(globalErrorHandler);

const PORT = process.env.PORT || 1823;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})
