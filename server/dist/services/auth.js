"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authService = exports.AuthService = void 0;
const models_1 = require("../models");
const utils_1 = require("../utils");
const middleware_1 = require("../middleware");
const mockDatabase_1 = require("../config/mockDatabase");
class AuthService {
    async register(data) {
        const useMock = (0, mockDatabase_1.isMockDatabase)();
        if (useMock) {
            // Use mock database
            const existingUser = mockDatabase_1.mockDb.findOne(data.email);
            if (existingUser) {
                throw new middleware_1.AppError('User with this email already exists', 400, 'USER_EXISTS');
            }
            const hashedPassword = await (0, utils_1.hashPassword)(data.password);
            const mockUser = await mockDatabase_1.mockDb.create({
                email: data.email,
                password: hashedPassword,
            });
            const payload = {
                userId: mockUser._id,
                email: mockUser.email,
            };
            const token = (0, utils_1.generateToken)(payload);
            return {
                token,
                user: {
                    id: mockUser._id,
                    email: mockUser.email,
                },
            };
        }
        else {
            // Use MongoDB
            // Check if user already exists
            const existingUser = await models_1.User.findOne({ email: data.email });
            if (existingUser) {
                throw new middleware_1.AppError('User with this email already exists', 400, 'USER_EXISTS');
            }
            // Hash password
            const hashedPassword = await (0, utils_1.hashPassword)(data.password);
            // Create user
            const user = await models_1.User.create({
                email: data.email,
                password: hashedPassword,
            });
            // Generate token
            const payload = {
                userId: user._id.toString(),
                email: user.email,
            };
            const token = (0, utils_1.generateToken)(payload);
            return {
                token,
                user: {
                    id: user._id.toString(),
                    email: user.email,
                },
            };
        }
    }
    async login(data) {
        const useMock = (0, mockDatabase_1.isMockDatabase)();
        if (useMock) {
            // Use mock database
            const mockUser = mockDatabase_1.mockDb.findOne(data.email);
            if (!mockUser) {
                throw new middleware_1.AppError('Invalid email or password', 401, 'INVALID_CREDENTIALS');
            }
            const isPasswordValid = await (0, utils_1.comparePasswords)(data.password, mockUser.password);
            if (!isPasswordValid) {
                throw new middleware_1.AppError('Invalid email or password', 401, 'INVALID_CREDENTIALS');
            }
            const payload = {
                userId: mockUser._id,
                email: mockUser.email,
            };
            const token = (0, utils_1.generateToken)(payload);
            return {
                token,
                user: {
                    id: mockUser._id,
                    email: mockUser.email,
                },
            };
        }
        else {
            // Use MongoDB
            // Find user
            const user = await models_1.User.findOne({ email: data.email }).select('+password');
            if (!user) {
                throw new middleware_1.AppError('Invalid email or password', 401, 'INVALID_CREDENTIALS');
            }
            // Compare passwords
            const isPasswordValid = await (0, utils_1.comparePasswords)(data.password, user.password);
            if (!isPasswordValid) {
                throw new middleware_1.AppError('Invalid email or password', 401, 'INVALID_CREDENTIALS');
            }
            // Generate token
            const payload = {
                userId: user._id.toString(),
                email: user.email,
            };
            const token = (0, utils_1.generateToken)(payload);
            return {
                token,
                user: {
                    id: user._id.toString(),
                    email: user.email,
                },
            };
        }
    }
    async validateToken(token) {
        try {
            const payload = JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
            return payload;
        }
        catch {
            return null;
        }
    }
}
exports.AuthService = AuthService;
exports.authService = new AuthService();
//# sourceMappingURL=auth.js.map