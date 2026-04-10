// Mock in-memory database for development without MongoDB
interface MockUser {
  _id: string;
  email: string;
  password: string;
  createdAt: Date;
}

interface MockApplication {
  _id: string;
  userId: string;
  companyName: string;
  position: string;
  status: 'Applied' | 'Phone Screen' | 'Interview' | 'Offer' | 'Rejected';
  appliedDate: Date;
  jdLink?: string;
  notes?: string;
  salaryRange?: {
    min?: number;
    max?: number;
  };
  createdAt: Date;
  updatedAt: Date;
}

class MockDatabase {
  private users: Map<string, MockUser> = new Map();
  private emailIndex: Map<string, string> = new Map();
  private applications: Map<string, MockApplication> = new Map();
  private userApplicationsIndex: Map<string, string[]> = new Map();

  // ============ USER METHODS ============
  findOne(email: string): MockUser | null {
    const userId = this.emailIndex.get(email);
    if (!userId) return null;
    return this.users.get(userId) || null;
  }

  async findOneAsync(email: string): Promise<MockUser | null> {
    return this.findOne(email);
  }

  async create(data: { email: string; password: string }): Promise<MockUser> {
    const userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const user: MockUser = {
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

  async updateOne(userId: string, updates: any): Promise<MockUser | null> {
    const user = this.users.get(userId);
    if (!user) return null;

    const updated = { ...user, ...updates };
    this.users.set(userId, updated);
    return updated;
  }

  // ============ APPLICATION METHODS ============
  async createApplication(data: any): Promise<MockApplication> {
    const appId = `app_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const now = new Date();
    
    const application: MockApplication = {
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

  getApplicationsByUserId(userId: string): MockApplication[] {
    const appIds = this.userApplicationsIndex.get(userId) || [];
    return appIds
      .map(id => this.applications.get(id))
      .filter((app): app is MockApplication => app !== undefined)
      .sort((a, b) => new Date(b.appliedDate).getTime() - new Date(a.appliedDate).getTime());
  }

  getApplicationById(applicationId: string): MockApplication | null {
    return this.applications.get(applicationId) || null;
  }

  updateApplication(applicationId: string, data: any): MockApplication | null {
    const app = this.applications.get(applicationId);
    if (!app) return null;

    const updated: MockApplication = {
      ...app,
      ...data,
      appliedDate: data.appliedDate instanceof Date ? data.appliedDate : (data.appliedDate ? new Date(data.appliedDate) : app.appliedDate),
      updatedAt: new Date(),
    };

    this.applications.set(applicationId, updated);
    console.log(`✏️  Application updated: ${applicationId}`);
    return updated;
  }

  deleteApplication(applicationId: string): MockApplication | null {
    const app = this.applications.get(applicationId);
    if (!app) return null;

    this.applications.delete(applicationId);
    
    // Remove from user's applications index
    const userApps = this.userApplicationsIndex.get(app.userId) || [];
    const filteredApps = userApps.filter(id => id !== applicationId);
    this.userApplicationsIndex.set(app.userId, filteredApps);
    
    console.log(`🗑️  Application deleted: ${applicationId}`);
    return app;
  }

  // ============ UTILITY METHODS ============
  clear(): void {
    this.users.clear();
    this.emailIndex.clear();
    this.applications.clear();
    this.userApplicationsIndex.clear();
    console.log('🗑️  Mock database cleared');
  }

  getAllUsers(): MockUser[] {
    return Array.from(this.users.values());
  }
}

export const mockDb = new MockDatabase();

let isMockDatabaseEnabled = false;

export const setMockDatabaseEnabled = (enabled: boolean) => {
  isMockDatabaseEnabled = enabled;
};

export const isMockDatabase = () => isMockDatabaseEnabled;

// Add some test credentials for easy testing
console.log('📌 Mock Database Initialized');
console.log('💡 Use these test credentials:');
console.log('   Email: test@example.com');
console.log('   Password: Test@123');
console.log('   (Or any credentials with 8+ chars, uppercase, lowercase, number)\n');
