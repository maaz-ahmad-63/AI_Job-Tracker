"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OPENAI_CONFIG = exports.SERVER_CONFIG = void 0;
exports.SERVER_CONFIG = {
    PORT: process.env.PORT || 5000,
    NODE_ENV: process.env.NODE_ENV || 'development',
    CLIENT_URL: process.env.CLIENT_URL || 'http://localhost:5173',
};
exports.OPENAI_CONFIG = {
    apiKey: process.env.OPENAI_API_KEY,
    model: process.env.OPENAI_MODEL || 'gpt-4-turbo',
};
//# sourceMappingURL=env.js.map