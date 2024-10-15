import { NextApiRequest, NextApiResponse } from "next";
import clientPromise from "../../../lib/mongodb"; // Use your mongodb.ts file here

interface Invoice {
  _id?: string;
  clientName: string;
  projectName: string;
  amount: number;
  date: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const client = await clientPromise;
  const db = client.db("time-tracking"); // Adjust to your DB name

  if (req.method === "GET") {
    try {
      // Fetch all invoices
      const invoices = await db.collection("invoices").find({}).toArray();
      res.status(200).json(invoices);
    } catch (error) {
      res.status(500).json({ message: "Unable to fetch invoices." });
    }
  } else if (req.method === "POST") {
    const { clientName, projectName, amount, date }: Invoice = req.body;

    if (!clientName || !projectName || !amount || !date) {
      return res.status(400).json({ message: "All fields are required." });
    }

    try {
      // Insert a new invoice
      const result = await db.collection("invoices").insertOne({
        clientName,
        projectName,
        amount,
        date: new Date(date),
        createdAt: new Date(),
      });

      // Fetch the newly inserted document
      const newInvoice = await db
        .collection("invoices")
        .findOne({ _id: result.insertedId });

      res.status(201).json(newInvoice);
    } catch (error) {
      res.status(500).json({ message: "Unable to create invoice." });
    }
  } else {
    res.setHeader("Allow", ["GET", "POST"]);
    res.status(405).json({ message: `Method ${req.method} Not Allowed` });
  }
}
