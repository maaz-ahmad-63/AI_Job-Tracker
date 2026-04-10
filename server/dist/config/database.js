"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.disconnectDatabase = exports.mockDb = exports.connectDatabase = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const mockDatabase_1 = require("./mockDatabase");
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/job-tracker';
const NODE_ENV = process.env.NODE_ENV || 'development';
const connectDatabase = async () => {
    try {
        const options = {
            retryWrites: true,
            w: 'majority',
            serverSelectionTimeoutMS: 5000,
            connectTimeoutMS: 5000,
        };
        await mongoose_1.default.connect(MONGODB_URI, options);
        console.log('✅ MongoDB connected successfully');
        (0, mockDatabase_1.setMockDatabaseEnabled)(false);
    }
    catch (error) {
        console.error('❌ MongoDB connection failed:', error);
        // In development, use mock database
        if (NODE_ENV === 'development') {
            console.warn('⚠️  MongoDB unavailable. Using in-memory mock database for development.');
            console.warn('💾 Data will NOT persist between server restarts.');
            console.warn('📝 To use persistent storage, check your MongoDB URI in .env\n');
            (0, mockDatabase_1.setMockDatabaseEnabled)(true);
        }
        else {
            process.exit(1);
        }
    }
};
exports.connectDatabase = connectDatabase;
var mockDatabase_2 = require("./mockDatabase");
Object.defineProperty(exports, "mockDb", { enumerable: true, get: function () { return mockDatabase_2.mockDb; } });
const disconnectDatabase = async () => {
    try {
        await mongoose_1.default.disconnect();
        console.log('✅ MongoDB disconnected successfully');
    }
    catch (error) {
        console.error('❌ MongoDB disconnection failed:', error);
    }
};
exports.disconnectDatabase = disconnectDatabase;
//# sourceMappingURL=database.js.map