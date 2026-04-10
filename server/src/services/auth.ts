import { User } from '../models';
import { IRegisterRequest, ILoginRequest, IAuthResponse, IAuthPayload } from '../types';
import { hashPassword, comparePasswords, generateToken } from '../utils';
import { AppError } from '../middleware';
import { isMockDatabase, mockDb } from '../config/mockDatabase';

export class AuthService {
  async register(data: IRegisterRequest): Promise<IAuthResponse> {
    const useMock = isMockDatabase();

    if (useMock) {
      // Use mock database
      const existingUser = mockDb.findOne(data.email);
      if (existingUser) {
        throw new AppError('User with this email already exists', 400, 'USER_EXISTS');
      }

      const hashedPassword = await hashPassword(data.password);
      const mockUser = await mockDb.create({
        email: data.email,
        password: hashedPassword,
      });

      const payload: IAuthPayload = {
        userId: mockUser._id,
        email: mockUser.email,
      };
      const token = generateToken(payload);

      return {
        token,
        user: {
          id: mockUser._id,
          email: mockUser.email,
        },
      };
    } else {
      // Use MongoDB
      // Check if user already exists
      const existingUser = await User.findOne({ email: data.email });
      if (existingUser) {
        throw new AppError('User with this email already exists', 400, 'USER_EXISTS');
      }

      // Hash password
      const hashedPassword = await hashPassword(data.password);

      // Create user
      const user = await User.create({
        email: data.email,
        password: hashedPassword,
      });

      // Generate token
      const payload: IAuthPayload = {
        userId: (user._id as any).toString(),
        email: user.email,
      };
      const token = generateToken(payload);

      return {
        token,
        user: {
          id: (user._id as any).toString(),
          email: user.email,
        },
      };
    }
  }

  async login(data: ILoginRequest): Promise<IAuthResponse> {
    const useMock = isMockDatabase();

    if (useMock) {
      // Use mock database
      const mockUser = mockDb.findOne(data.email);
      if (!mockUser) {
        throw new AppError('Invalid email or password', 401, 'INVALID_CREDENTIALS');
      }

      const isPasswordValid = await comparePasswords(data.password, mockUser.password);
      if (!isPasswordValid) {
        throw new AppError('Invalid email or password', 401, 'INVALID_CREDENTIALS');
      }

      const payload: IAuthPayload = {
        userId: mockUser._id,
        email: mockUser.email,
      };
      const token = generateToken(payload);

      return {
        token,
        user: {
          id: mockUser._id,
          email: mockUser.email,
        },
      };
    } else {
      // Use MongoDB
      // Find user
      const user = await User.findOne({ email: data.email }).select('+password');
      if (!user) {
        throw new AppError('Invalid email or password', 401, 'INVALID_CREDENTIALS');
      }

      // Compare passwords
      const isPasswordValid = await comparePasswords(data.password, user.password);
      if (!isPasswordValid) {
        throw new AppError('Invalid email or password', 401, 'INVALID_CREDENTIALS');
      }

      // Generate token
      const payload: IAuthPayload = {
        userId: (user._id as any).toString(),
        email: user.email,
      };
      const token = generateToken(payload);

      return {
        token,
        user: {
          id: (user._id as any).toString(),
          email: user.email,
        },
      };
    }
  }

  async validateToken(token: string): Promise<IAuthPayload | null> {
    try {
      const payload = JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString()) as IAuthPayload;
      return payload;
    } catch {
      return null;
    }
  }
}

export const authService = new AuthService();
