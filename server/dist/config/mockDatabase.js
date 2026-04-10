"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isMockDatabase = exports.setMockDatabaseEnabled = exports.mockDb = void 0;
class MockDatabase {
    constructor() {
        this.users = new Map();
        this.emailIndex = new Map();
        this.applications = new Map();
        this.userApplicationsIndex = new Map();
    }
    // ============ USER METHODS ============
    findOne(email) {
        const userId = this.emailIndex.get(email);
        if (!userId)
            return null;
        return this.users.get(userId) || null;
    }
    async findOneAsync(email) {
        return this.findOne(email);
    }
    async create(data) {
        const userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        const user = {
            _id: userId,
            email: data.email,
            password: data.password,
            createdAt: new Date(),
        };
        this.users.set(userId, user);
        this.emailIndex.set(data.email, userId);
        this.userApplicationsIndex.set(userId, []);
        console.log(`📝 Mock user created: ${data.email}`);
        return user;
    }
    async updateOne(userId, updates) {
        const user = this.users.get(userId);
        if (!user)
            return null;
        const updated = { ...user, ...updates };
        this.users.set(userId, updated);
        return updated;
    }
    // ============ APPLICATION METHODS ============
    async createApplication(data) {
        const appId = `app_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        const now = new Date();
        const application = {
            _id: appId,
            userId: data.userId,
            companyName: data.companyName,
            position: data.position,
            status: data.status || 'Applied',
            appliedDate: data.appliedDate instanceof Date ? data.appliedDate : new Date(data.appliedDate || now),
            jdLink: data.jdLink,
            notes: data.notes,
            salaryRange: data.salaryRange,
            createdAt: now,
            updatedAt: now,
        };
        this.applications.set(appId, application);
        // Add to user's applications index
        const userApps = this.userApplicationsIndex.get(data.userId) || [];
        userApps.push(appId);
        this.userApplicationsIndex.set(data.userId, userApps);
        console.log(`✅ Application created for user ${data.userId}: ${data.companyName}`);
        return application;
    }
    getApplicationsByUserId(userId) {
        const appIds = this.userApplicationsIndex.get(userId) || [];
        return appIds
            .map(id => this.applications.get(id))
            .filter((app) => app !== undefined)
            .sort((a, b) => new Date(b.appliedDate).getTime() - new Date(a.appliedDate).getTime());
    }
    getApplicationById(applicationId) {
        return this.applications.get(applicationId) || null;
    }
    updateApplication(applicationId, data) {
        const app = this.applications.get(applicationId);
        if (!app)
            return null;
        const updated = {
            ...app,
            ...data,
            appliedDate: data.appliedDate instanceof Date ? data.appliedDate : (data.appliedDate ? new Date(data.appliedDate) : app.appliedDate),
            updatedAt: new Date(),
        };
        this.applications.set(applicationId, updated);
        console.log(`✏️  Application updated: ${applicationId}`);
        return updated;
    }
    deleteApplication(applicationId) {
        const app = this.applications.get(applicationId);
        if (!app)
            return null;
        this.applications.delete(applicationId);
        // Remove from user's applications index
        const userApps = this.userApplicationsIndex.get(app.userId) || [];
        const filteredApps = userApps.filter(id => id !== applicationId);
        this.userApplicationsIndex.set(app.userId, filteredApps);
        console.log(`🗑️  Application deleted: ${applicationId}`);
        return app;
    }
    // ============ UTILITY METHODS ============
    clear() {
        this.users.clear();
        this.emailIndex.clear();
        this.applications.clear();
        this.userApplicationsIndex.clear();
        console.log('🗑️  Mock database cleared');
    }
    getAllUsers() {
        return Array.from(this.users.values());
    }
}
exports.mockDb = new MockDatabase();
let isMockDatabaseEnabled = false;
const setMockDatabaseEnabled = (enabled) => {
    isMockDatabaseEnabled = enabled;
};
exports.setMockDatabaseEnabled = setMockDatabaseEnabled;
const isMockDatabase = () => isMockDatabaseEnabled;
exports.isMockDatabase = isMockDatabase;
// Add some test credentials for easy testing
console.log('📌 Mock Database Initialized');
console.log('💡 Use these test credentials:');
console.log('   Email: test@example.com');
console.log('   Password: Test@123');
console.log('   (Or any credentials with 8+ chars, uppercase, lowercase, number)\n');
//# sourceMappingURL=mockDatabase.js.map