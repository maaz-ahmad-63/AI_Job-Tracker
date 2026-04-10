import mongoose, { ConnectOptions } from 'mongoose';
import { mockDb, setMockDatabaseEnabled } from './mockDatabase';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/job-tracker';
const NODE_ENV = process.env.NODE_ENV || 'development';

export const connectDatabase = async (): Promise<void> => {
  try {
    const options: ConnectOptions = {
      retryWrites: true,
      w: 'majority',
      serverSelectionTimeoutMS: 5000,
      connectTimeoutMS: 5000,
    };

    await mongoose.connect(MONGODB_URI, options);
    console.log('✅ MongoDB connected successfully');
    setMockDatabaseEnabled(false);
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error);
    
    // In development, use mock database
    if (NODE_ENV === 'development') {
      console.warn('⚠️  MongoDB unavailable. Using in-memory mock database for development.');
      console.warn('💾 Data will NOT persist between server restarts.');
      console.warn('📝 To use persistent storage, check your MongoDB URI in .env\n');
      setMockDatabaseEnabled(true);
    } else {
      process.exit(1);
    }
  }
};

export { mockDb } from './mockDatabase';

export const disconnectDatabase = async (): Promise<void> => {
  try {
    await mongoose.disconnect();
    console.log('✅ MongoDB disconnected successfully');
  } catch (error) {
    console.error('❌ MongoDB disconnection failed:', error);
  }
};
