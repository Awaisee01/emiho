import mongoose from 'mongoose';

export interface IEvent extends mongoose.Document {
  title: string;
  description: string;
  organizer: mongoose.Types.ObjectId;
  date: Date;
  endDate?: Date;
  location: {
    type: 'virtual' | 'physical';
    address?: string;
    meetingLink?: string;
  };
  attendees: {
    user: mongoose.Types.ObjectId;
    status: 'pending' | 'accepted' | 'declined';
  }[];
  category: string;
  isPrivate: boolean;
  isPremium: boolean;
  maxAttendees?: number;
  createdAt: Date;
  updatedAt: Date;
}

const EventSchema = new mongoose.Schema<IEvent>({
  title: { type: String, required: true },
  description: { type: String, required: true },
  organizer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: Date, required: true },
  endDate: { type: Date },
  location: {
    type: { type: String, enum: ['virtual', 'physical'], required: true },
    address: { type: String },
    meetingLink: { type: String }
  },
  attendees: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    status: { type: String, enum: ['pending', 'accepted', 'declined'], default: 'pending' }
  }],
  category: { type: String, required: true },
  isPrivate: { type: Boolean, default: false },
  isPremium: { type: Boolean, default: false },
  maxAttendees: { type: Number }
}, {
  timestamps: true
});

export default mongoose.models.Event || mongoose.model<IEvent>('Event', EventSchema);