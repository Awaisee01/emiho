import mongoose from 'mongoose';

export interface ILegacyBook extends mongoose.Document {
  title: string;
  description: string;
  author: mongoose.Types.ObjectId;
  dedicatedTo: string;
  pages: {
    title: string;
    content: string;
    media: {
      type: 'image' | 'video' | 'audio';
      url: string;
      publicId: string;
    }[];
    order: number;
  }[];
  collaborators: mongoose.Types.ObjectId[];
  isPublic: boolean;
  isPremium: boolean;
  theme: string;
  createdAt: Date;
  updatedAt: Date;
}

const LegacyBookSchema = new mongoose.Schema<ILegacyBook>({
  title: { type: String, required: true },
  description: { type: String, required: true },
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  dedicatedTo: { type: String, required: true },
  pages: [{
    title: { type: String, required: true },
    content: { type: String, required: true },
    media: [{
      type: { type: String, enum: ['image', 'video', 'audio'] },
      url: { type: String },
      publicId: { type: String }
    }],
    order: { type: Number, required: true }
  }],
  collaborators: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  isPublic: { type: Boolean, default: false },
  isPremium: { type: Boolean, default: false },
  theme: { type: String, default: 'classic' }
}, {
  timestamps: true
});

export default mongoose.models.LegacyBook || mongoose.model<ILegacyBook>('LegacyBook', LegacyBookSchema);