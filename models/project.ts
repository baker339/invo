import mongoose, { Schema, Document } from "mongoose";

export interface Project extends Document {
  _id: mongoose.Types.ObjectId;
  userid: string;
  name: string;
  description?: string;
}

const ProjectSchema: Schema = new Schema({
  _id: { type: mongoose.Types.ObjectId, auto: true },
  userid: { type: String, required: true },
  name: { type: String, required: true },
  description: { type: String },
});

export default mongoose.models.Project ||
  mongoose.model<Project>("Project", ProjectSchema);
