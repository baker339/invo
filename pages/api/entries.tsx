// pages/api/entries.ts
import type { NextApiRequest, NextApiResponse } from "next";
import clientPromise from "../../lib/mongodb";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const client = await clientPromise;
    const db = client.db("time-tracker");

    if (req.method === "POST") {
      const { description, timeSpent, date, userId } = req.body;

      const entry = {
        description,
        timeSpent: parseInt(timeSpent, 10),
        date: new Date(date), // Make sure the date is correctly formatted
        createdAt: new Date(),
        userId,
      };

      try {
        const result = await db.collection("entries").insertOne(entry);
        res.status(200).json({ _id: result.insertedId, ...entry });
      } catch (error) {
        res.status(500).json({ message: "Failed to add entry" });
      }
    } else if (req.method === "GET") {
      const { userId } = req.query;
      const collection = db.collection("entries");
      const entries = await collection
        .find({ userId })
        .sort({ createdAt: -1 })
        .toArray();
      res.status(200).json(entries);
    } else {
      res.setHeader("Allow", ["POST", "GET"]);
      res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error connecting to database" });
  }
}
