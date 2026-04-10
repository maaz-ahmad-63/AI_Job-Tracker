"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.aiRoutes = exports.applicationRoutes = exports.healthRoutes = exports.authRoutes = void 0;
var auth_1 = require("./auth");
Object.defineProperty(exports, "authRoutes", { enumerable: true, get: function () { return __importDefault(auth_1).default; } });
var health_1 = require("./health");
Object.defineProperty(exports, "healthRoutes", { enumerable: true, get: function () { return __importDefault(health_1).default; } });
var applications_1 = require("./applications");
Object.defineProperty(exports, "applicationRoutes", { enumerable: true, get: function () { return __importDefault(applications_1).default; } });
var ai_1 = require("./ai");
Object.defineProperty(exports, "aiRoutes", { enumerable: true, get: function () { return __importDefault(ai_1).default; } });
//# sourceMappingURL=index.js.map