import mongoose from 'mongoose';

export interface ICommunity extends mongoose.Document {
  name: string;
  description: string;
  creator: mongoose.Types.ObjectId;
  members: mongoose.Types.ObjectId[];
  category: string;
  image?: string;
  isPrivate: boolean;
  isPremium: boolean;
  createdAt: Date;
  updatedAt: Date;
    posts?: mongoose.Types.ObjectId[];
}

const CommunitySchema = new mongoose.Schema<ICommunity>({
  name: { type: String, required: true },
  description: { type: String, required: true },
  creator: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  category: { type: String, required: true },
  image: { type: String },
  isPrivate: { type: Boolean, default: false },
  isPremium: { type: Boolean, default: false },

  // 👇 Add this
  posts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Post' }]
}, {
  timestamps: true
});


const Community =
  (mongoose.models.Community as mongoose.Model<ICommunity>) ||
  mongoose.model<ICommunity>('Community', CommunitySchema);

export default Community;