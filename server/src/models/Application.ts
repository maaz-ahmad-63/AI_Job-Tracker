import mongoose, { Schema, Document, Types } from 'mongoose';
import { ApplicationStatus } from '../types';

interface IApplicationDocument extends Document {
  userId: Types.ObjectId;
  company: string;
  role: string;
  jdLink?: string;
  notes?: string;
  dateApplied: Date;
  status: ApplicationStatus;
  salaryRange?: {
    min?: number;
    max?: number;
  };
  requiredSkills?: string[];
  niceToHaveSkills?: string[];
  seniority?: string;
  location?: string;
  resumeSuggestions?: string[];
  createdAt: Date;
  updatedAt: Date;
}

const applicationSchema = new Schema<IApplicationDocument>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
    },
    company: {
      type: String,
      required: [true, 'Company name is required'],
      trim: true,
    },
    role: {
      type: String,
      required: [true, 'Job role is required'],
      trim: true,
    },
    jdLink: {
      type: String,
      trim: true,
    },
    notes: {
      type: String,
      trim: true,
    },
    dateApplied: {
      type: Date,
      default: Date.now,
    },
    status: {
      type: String,
      enum: ['Applied', 'Phone Screen', 'Interview', 'Offer', 'Rejected'],
      default: 'Applied',
    },
    salaryRange: {
      min: Number,
      max: Number,
    },
    requiredSkills: [String],
    niceToHaveSkills: [String],
    seniority: String,
    location: String,
    resumeSuggestions: [String],
  },
  {
    timestamps: true,
  }
);

export const Application = mongoose.model<IApplicationDocument>('Application', applicationSchema);
