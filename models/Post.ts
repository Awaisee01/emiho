import mongoose from "mongoose";

export interface IPost extends mongoose.Document {
  author: mongoose.Types.ObjectId;
  community: mongoose.Types.ObjectId;
  content: string;
  image?: string;
  createdAt: Date;
  updatedAt: Date;
}

const PostSchema = new mongoose.Schema<IPost>(
  {
    author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    community: { type: mongoose.Schema.Types.ObjectId, ref: "Community", required: true },
    content: { type: String, required: true },
    image: { type: String },
  },
  { timestamps: true }
);

const Post =
  (mongoose.models.Post as mongoose.Model<IPost>) ||
  mongoose.model<IPost>("Post", PostSchema);

export default Post;
