"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.applicationService = exports.ApplicationService = void 0;
const config_1 = require("../config");
const models_1 = require("../models");
const middleware_1 = require("../middleware");
class ApplicationService {
    async createApplication(userId, data) {
        const useMock = (0, config_1.isMockDatabase)();
        if (useMock) {
            // Use mock database
            return await config_1.mockDb.createApplication({
                ...data,
                userId,
            });
        }
        else {
            // Use MongoDB
            const application = await models_1.Application.create({
                ...data,
                userId,
            });
            return application.toObject();
        }
    }
    async getApplications(userId) {
        const useMock = (0, config_1.isMockDatabase)();
        if (useMock) {
            // Use mock database
            return config_1.mockDb.getApplicationsByUserId(userId);
        }
        else {
            // Use MongoDB
            const applications = await models_1.Application.find({ userId }).sort({ appliedDate: -1 });
            return applications.map(app => app.toObject());
        }
    }
    async getApplicationById(userId, applicationId) {
        const useMock = (0, config_1.isMockDatabase)();
        if (useMock) {
            // Use mock database
            const app = config_1.mockDb.getApplicationById(applicationId);
            if (!app || app.userId !== userId) {
                throw new middleware_1.AppError('Application not found', 404, 'NOT_FOUND');
            }
            return app;
        }
        else {
            // Use MongoDB
            const application = await models_1.Application.findOne({ _id: applicationId, userId });
            if (!application) {
                throw new middleware_1.AppError('Application not found', 404, 'NOT_FOUND');
            }
            return application.toObject();
        }
    }
    async updateApplication(userId, applicationId, data) {
        const useMock = (0, config_1.isMockDatabase)();
        if (useMock) {
            // Use mock database
            const app = config_1.mockDb.updateApplication(applicationId, data);
            if (!app || app.userId !== userId) {
                throw new middleware_1.AppError('Application not found', 404, 'NOT_FOUND');
            }
            return app;
        }
        else {
            // Use MongoDB
            const application = await models_1.Application.findOneAndUpdate({ _id: applicationId, userId }, data, { new: true });
            if (!application) {
                throw new middleware_1.AppError('Application not found', 404, 'NOT_FOUND');
            }
            return application.toObject();
        }
    }
    async deleteApplication(userId, applicationId) {
        const useMock = (0, config_1.isMockDatabase)();
        if (useMock) {
            // Use mock database
            const deleted = config_1.mockDb.deleteApplication(applicationId);
            if (!deleted || deleted.userId !== userId) {
                throw new middleware_1.AppError('Application not found', 404, 'NOT_FOUND');
            }
        }
        else {
            // Use MongoDB
            const application = await models_1.Application.findOneAndDelete({ _id: applicationId, userId });
            if (!application) {
                throw new middleware_1.AppError('Application not found', 404, 'NOT_FOUND');
            }
        }
    }
}
exports.ApplicationService = ApplicationService;
exports.applicationService = new ApplicationService();
//# sourceMappingURL=application.js.map