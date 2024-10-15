import { NextApiRequest, NextApiResponse } from "next";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id } = req.query;

  if (!id || Array.isArray(id)) {
    return res.status(400).json({ message: "Invalid ID format" });
  }

  const client = await clientPromise;
  const db = client.db("time-tracker");
  const objectId = new ObjectId(id);

  // Handle the update (PUT) request
  if (req.method === "PUT") {
    const { name, contactInfo } = req.body;

    if (!name || !contactInfo) {
      return res.status(400).json({ message: "Missing fields" });
    }

    try {
      const result = await db
        .collection("clients")
        .updateOne({ _id: objectId }, { $set: { name, contactInfo } });

      if (result.modifiedCount === 1) {
        res.status(200).json({ message: "Client updated successfully" });
      } else {
        res.status(404).json({ message: "Client not found" });
      }
    } catch (error) {
      res.status(500).json({ error: "Failed to update client" });
    }
  } else if (req.method === "DELETE") {
    try {
      const result = await db
        .collection("clients")
        .deleteOne({ _id: new ObjectId(id as string) });

      if (result.deletedCount === 1) {
        res.status(200).json({ message: "Client deleted successfully" });
      } else {
        res.status(404).json({ message: "Client not found" });
      }
    } catch (error) {
      res.status(500).json({ error: "Failed to delete client" });
    }
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}
