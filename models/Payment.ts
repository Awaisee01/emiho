import mongoose, { Schema, Document } from "mongoose";

export interface IPayment extends Document {
  user: mongoose.Schema.Types.ObjectId;
  stripeCustomerId?: string;
  subscriptionId?: string;
  stripeSessionId: string;
  priceId: string;
  amount_total: number;
  currency: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

const PaymentSchema = new Schema<IPayment>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    stripeCustomerId: { type: String },
    subscriptionId: { type: String },
    stripeSessionId: { type: String, required: true, unique: true }, // 👈 link to session
    priceId: { type: String, required: true },
    amount_total: { type: Number, required: true },
    currency: { type: String, required: true },
    status: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.models.Payment ||
  mongoose.model<IPayment>("Payment", PaymentSchema);
