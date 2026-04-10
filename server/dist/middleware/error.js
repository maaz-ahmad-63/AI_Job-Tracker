"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.asyncHandler = exports.errorHandler = exports.AppError = void 0;
class AppError extends Error {
    constructor(message, statusCode, code) {
        super(message);
        this.message = message;
        this.statusCode = statusCode;
        this.code = code;
    }
}
exports.AppError = AppError;
const errorHandler = (error, req, res, next) => {
    console.error('Error:', error);
    if (error instanceof AppError) {
        res.status(error.statusCode).json({
            message: error.message,
            code: error.code,
        });
        return;
    }
    // MongoDB duplicate key error
    if (error.code === 11000) {
        const field = Object.keys(error.keyPattern)[0];
        res.status(400).json({
            message: `A record with this ${field} already exists`,
            code: 'DUPLICATE_KEY',
        });
        return;
    }
    // MongoDB validation error
    if (error.name === 'ValidationError') {
        const messages = Object.values(error.errors).map((err) => err.message);
        res.status(400).json({
            message: 'Validation failed',
            details: messages,
            code: 'VALIDATION_ERROR',
        });
        return;
    }
    res.status(500).json({
        message: 'Internal server error',
        code: 'INTERNAL_SERVER_ERROR',
    });
};
exports.errorHandler = errorHandler;
const asyncHandler = (fn) => {
    return (req, res, next) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
};
exports.asyncHandler = asyncHandler;
//# sourceMappingURL=error.js.map