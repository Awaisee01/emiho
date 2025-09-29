


import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

// Profile interface
export interface IProfile {
  bio?: string;
  location?: string;
  website?: string;
}

// Subscription interface
export interface ISubscription {
  plan: 'Free' | 'Pro' | 'Premium';
  status: 'active' | 'inactive' | 'cancelled';
  startDate?: Date;
  endDate?: Date;
}

// Extended User interface
export interface IUser extends mongoose.Document {
  name: string;
  email: string;
  password?: string;
  provider: string;
  image?: string;
  profile?: IProfile;
  subscription?: ISubscription;
  emailVerified?: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const UserSchema = new mongoose.Schema<IUser>({
  name: { 
    type: String, 
    required: true,
    trim: true,
    maxlength: 100
  },
  email: { 
    type: String, 
    required: true, 
    unique: true,
    lowercase: true,
    trim: true,
    index: true  // Remove this if you're using schema.index() below
  },
  password: { 
    type: String,
    minlength: 6
  },
 provider: { type: String, required: true, default: 'local' },
  image: { 
    type: String,
    default: null
  },
  profile: {
    bio: {
      type: String,
      maxlength: 500,
      default: ''
    },
    location: {
      type: String,
      maxlength: 100,
      default: ''
    },
    website: {
      type: String,
      maxlength: 255,
      default: '',
      validate: {
        validator: function(v: string) {
          if (!v) return true; // Allow empty string
          return /^https?:\/\/.+/.test(v);
        },
        message: 'Website must be a valid URL starting with http:// or https://'
      }
    }
  },
  subscription: {
    plan: {
      type: String,
      enum: ['Free', 'Pro', 'Premium'],
      default: 'Free'
    },
    status: {
      type: String,
      enum: ['active', 'inactive', 'cancelled'],
      default: 'active'
    },
    startDate: {
      type: Date,
      default: null
    },
    endDate: {
      type: Date,
      default: null
    }
  },
  emailVerified: {
    type: Date,
    default: null
  }
}, { 
  timestamps: true 
});

// Hash password before save
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  if (this.password) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

// Compare password method
UserSchema.methods.comparePassword = async function (candidatePassword: string) {
  if (!this.password) return false;
  return bcrypt.compare(candidatePassword, this.password);
};

// Update the updatedAt field on findOneAndUpdate
UserSchema.pre('findOneAndUpdate', function(next) {
  this.set({ updatedAt: new Date() });
  next();
});

// Create indexes for better performance (remove email index since unique: true already creates one)
UserSchema.index({ provider: 1 });

export default mongoose.models.User || mongoose.model<IUser>('User', UserSchema);