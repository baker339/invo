import type { NextApiRequest, NextApiResponse } from "next";
import clientPromise from "@/lib/mongodb";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const { userId, projectId, receiptData } = req.body;

    if (!userId || !projectId || !receiptData) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    try {
      const client = await clientPromise;
      const db = client.db("time-tracker"); // Use your MongoDB database name

      const receipt = {
        userId,
        projectId,
        receiptData,
        createdAt: new Date(),
      };

      await db.collection("receipts").insertOne(receipt);

      return res.status(200).json({ success: true, receipt });
    } catch (error) {
      return res
        .status(500)
        .json({ error: "Error saving receipt to database" });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
