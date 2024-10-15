import mongoose, { Schema, Document } from "mongoose";

interface Invoice extends Document {
  client: string;
  project: string;
  timeEntries: string[]; // Array of time entry IDs
  total: number;
  issueDate: Date;
  dueDate: Date;
  notes?: string;
}

const InvoiceSchema: Schema = new Schema({
  client: { type: String, required: true },
  project: { type: String, required: true },
  timeEntries: [{ type: mongoose.Schema.Types.ObjectId, ref: "TimeEntry" }],
  total: { type: Number, required: true },
  issueDate: { type: Date, required: true },
  dueDate: { type: Date, required: true },
  notes: { type: String },
});

export default mongoose.models.Invoice ||
  mongoose.model<Invoice>("Invoice", InvoiceSchema);
