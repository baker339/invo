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
    const { name, description } = req.body;

    if (!name || !description) {
      return res.status(400).json({ message: "Missing fields" });
    }

    try {
      const result = await db
        .collection("projects")
        .updateOne({ _id: objectId }, { $set: { name, description } });

      if (result.modifiedCount === 1) {
        res.status(200).json({ message: "Project updated successfully" });
      } else {
        res.status(404).json({ message: "Project not found" });
      }
    } catch (error) {
      res.status(500).json({ error: "Failed to update project" });
    }
  } else if (req.method === "DELETE") {
    try {
      const result = await db
        .collection("projects")
        .deleteOne({ _id: new ObjectId(id as string) });

      if (result.deletedCount === 1) {
        res.status(200).json({ message: "Project deleted successfully" });
      } else {
        res.status(404).json({ message: "Project not found" });
      }
    } catch (error) {
      res.status(500).json({ error: "Failed to delete project" });
    }
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}
