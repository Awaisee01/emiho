import mongoose from 'mongoose';

export interface IStory extends mongoose.Document {
  title: string;
  content: string;
  author: mongoose.Types.ObjectId;
  category: 'Family' | 'Friend' | 'Place' | 'Kings' | 'Kingdoms';
  media: {
    type: 'image' | 'video' | 'audio';
    url: string;
    publicId: string;
  }[];
  likes: mongoose.Types.ObjectId[];
  shares: mongoose.Types.ObjectId[];
  comments: {
    author: mongoose.Types.ObjectId;
    content: string;
    createdAt: Date;
  }[];
  isPrivate: boolean;
  isPremium: boolean;
  tags: string[];
  views: number;
  createdAt: Date;
  updatedAt: Date;
}

const StorySchema = new mongoose.Schema<IStory>({
  title: { type: String, required: true },
  content: { type: String, required: true },
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  category: {
    type: String,
    enum: ['Family', 'Friend', 'Place', 'Kings', 'Kingdoms'],
    required: true
  },
  media: [{
    type: { type: String, enum: ['image', 'video', 'audio'] },
    url: { type: String },
    publicId: { type: String }
  }],
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  shares: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  comments: [{
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    content: { type: String },
    createdAt: { type: Date, default: Date.now }
  }],
  isPrivate: { type: Boolean, default: false },
  isPremium: { type: Boolean, default: false },
  tags: [{ type: String }],
  views: { type: Number, default: 0 }
}, {
  timestamps: true
});

export default mongoose.models.Story || mongoose.model<IStory>('Story', StorySchema);