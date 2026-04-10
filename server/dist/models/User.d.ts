import mongoose, { Document, Types } from 'mongoose';
interface IUserDocument extends Document {
    email: string;
    password: string;
    createdAt: Date;
    updatedAt: Date;
}
export declare const User: mongoose.Model<IUserDocument, {}, {}, {}, mongoose.Document<unknown, {}, IUserDocument> & IUserDocument & {
    _id: Types.ObjectId;
}, any>;
export {};
//# sourceMappingURL=User.d.ts.map