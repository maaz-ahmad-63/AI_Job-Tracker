"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const config_1 = require("./config");
const middleware_1 = require("./middleware");
const routes_1 = require("./routes");
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5002;
// Middleware
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use(middleware_1.corsMiddleware);
// Routes
app.use('/api/health', routes_1.healthRoutes);
app.use('/api/auth', routes_1.authRoutes);
app.use('/api/applications', routes_1.applicationRoutes);
app.use('/api/ai', routes_1.aiRoutes);
// Health check
app.get('/', (req, res) => {
    res.json({ message: 'Job Application Tracker API is running' });
});
// 404 handler
app.use('*', (req, res) => {
    res.status(404).json({ message: 'Route not found' });
});
// Error handler (must be last)
app.use(middleware_1.errorHandler);
// Start server
const startServer = async () => {
    try {
        await (0, config_1.connectDatabase)();
        app.listen(PORT, () => {
            console.log(`\n🚀 Server running on http://localhost:${PORT}`);
            console.log(`📍 API base: http://localhost:${PORT}/api\n`);
        });
    }
    catch (error) {
        console.error('❌ Failed to start server:', error);
        process.exit(1);
    }
};
startServer();
exports.default = app;
//# sourceMappingURL=index.js.map