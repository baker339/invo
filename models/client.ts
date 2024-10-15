import mongoose, { Schema, Document } from "mongoose";

export interface Client extends Document {
  _id: mongoose.Types.ObjectId;
  userid: string;
  name: string;
  contactInfo: string;
}

const ClientSchema: Schema = new Schema({
  _id: { type: mongoose.Types.ObjectId, auto: true },
  userid: { type: String, required: true },
  name: { type: String, required: true },
  contactInfo: { type: String },
});

export default mongoose.models.Client ||
  mongoose.model<Client>("Client", ClientSchema);
