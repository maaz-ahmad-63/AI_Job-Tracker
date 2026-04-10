import { isMockDatabase, mockDb } from '../config';
import { Application } from '../models';
import { IApplication } from '../types';
import { AppError } from '../middleware';

export interface CreateApplicationInput {
  companyName: string;
  position: string;
  status: 'applied' | 'interviewing' | 'offered' | 'rejected' | 'withdrawn';
  appliedDate: string;
  jdLink?: string;
  notes?: string;
  salaryRange?: string;
}

export interface UpdateApplicationInput {
  companyName?: string;
  position?: string;
  status?: 'applied' | 'interviewing' | 'offered' | 'rejected' | 'withdrawn';
  appliedDate?: string;
  jdLink?: string;
  notes?: string;
  salaryRange?: string;
}

export class ApplicationService {
  async createApplication(userId: string, data: CreateApplicationInput): Promise<IApplication> {
    const useMock = isMockDatabase();

    if (useMock) {
      // Use mock database
      return await mockDb.createApplication({
        ...data,
        userId,
      });
    } else {
      // Use MongoDB
      const application = await Application.create({
        ...data,
        userId,
      });

      return application.toObject() as IApplication;
    }
  }

  async getApplications(userId: string): Promise<IApplication[]> {
    const useMock = isMockDatabase();

    if (useMock) {
      // Use mock database
      return mockDb.getApplicationsByUserId(userId);
    } else {
      // Use MongoDB
      const applications = await Application.find({ userId }).sort({ appliedDate: -1 });
      return applications.map(app => app.toObject() as IApplication);
    }
  }

  async getApplicationById(userId: string, applicationId: string): Promise<IApplication> {
    const useMock = isMockDatabase();

    if (useMock) {
      // Use mock database
      const app = mockDb.getApplicationById(applicationId);
      if (!app || app.userId !== userId) {
        throw new AppError('Application not found', 404, 'NOT_FOUND');
      }
      return app;
    } else {
      // Use MongoDB
      const application = await Application.findOne({ _id: applicationId, userId });
      if (!application) {
        throw new AppError('Application not found', 404, 'NOT_FOUND');
      }
      return application.toObject() as IApplication;
    }
  }

  async updateApplication(userId: string, applicationId: string, data: UpdateApplicationInput): Promise<IApplication> {
    const useMock = isMockDatabase();

    if (useMock) {
      // Use mock database
      const app = mockDb.updateApplication(applicationId, data);
      if (!app || app.userId !== userId) {
        throw new AppError('Application not found', 404, 'NOT_FOUND');
      }
      return app;
    } else {
      // Use MongoDB
      const application = await Application.findOneAndUpdate(
        { _id: applicationId, userId },
        data,
        { new: true }
      );
      if (!application) {
        throw new AppError('Application not found', 404, 'NOT_FOUND');
      }
      return application.toObject() as IApplication;
    }
  }

  async deleteApplication(userId: string, applicationId: string): Promise<void> {
    const useMock = isMockDatabase();

    if (useMock) {
      // Use mock database
      const deleted = mockDb.deleteApplication(applicationId);
      if (!deleted || deleted.userId !== userId) {
        throw new AppError('Application not found', 404, 'NOT_FOUND');
      }
    } else {
      // Use MongoDB
      const application = await Application.findOneAndDelete({ _id: applicationId, userId });
      if (!application) {
        throw new AppError('Application not found', 404, 'NOT_FOUND');
      }
    }
  }
}

export const applicationService = new ApplicationService();
