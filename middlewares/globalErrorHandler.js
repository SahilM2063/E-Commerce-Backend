const globalErrorHandler = (err, req, res, next) => {
    // stack
    // message

    const stack = err?.stack;
    const statusCode = err?.statusCode ? err?.statusCode : 500;
    const message = err?.message;

    res.status(statusCode).json({
        stack, message
    })
}

const notFound = (req, res, next) => {
    const err = new Error(`Route ${req.originalUrl} Not Found!`);
    next(err);
}

module.exports = { globalErrorHandler, notFound }