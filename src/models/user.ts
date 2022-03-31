import {Schema, model} from 'mongoose';

export interface User {
  id: string
  name: string
  email: string
  role: string;
  corporateId: string;
  validUntil?: Date
}

export const UserSchema = new Schema<User>({
  id:       {type: String, required: true},
  name:       {type: String, required: true},
  email:       {type: String, required: true},
  role:       {type: String, required: true},
  corporateId:       {type: String, required: true},
  validUntil:       {type: Date, required: false},
}, {timestamps: true} )

export const UserModel = model<User>('User', UserSchema);
