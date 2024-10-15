// pages/api/entries/[id].ts
import { NextApiRequest, NextApiResponse } from "next";
import clientPromise from "../../../lib/mongodb";
import { ObjectId } from "mongodb"; // Import ObjectId

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const client = await clientPromise;
  const db = client.db("time-tracker");

  const { id } = req.query;

  if (typeof id !== "string") {
    res.status(400).json({ message: "Invalid ID" });
    return;
  }

  if (req.method === "PUT") {
    // Update an entry
    const { description, timeSpent, date } = req.body;

    try {
      const result = await db.collection("entries").updateOne(
        { _id: new ObjectId(id) }, // Use the id here
        {
          $set: {
            description,
            timeSpent: parseInt(timeSpent, 10),
            date: new Date(date),
          },
        }
      );
      res.status(200).json({ message: "Entry updated" });
    } catch (error) {
      res.status(500).json({ message: "Failed to update entry" });
    }
  } else if (req.method === "DELETE") {
    // Delete an entry
    try {
      await db.collection("entries").deleteOne({ _id: new ObjectId(id) }); // Use the id here
      res.status(200).json({ message: "Entry deleted" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete entry" });
    }
  } else {
    res.setHeader("Allow", ["PUT", "DELETE"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
