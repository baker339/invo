import { NextApiRequest, NextApiResponse } from "next";
import clientPromise from "@/lib/mongodb";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const client = await clientPromise;
  const db = client.db("time-tracker");
  const collection = db.collection("projects");

  if (req.method === "POST") {
    try {
      const newProject = {
        name: req.body.name,
        userId: req.body.userId,
      };
      const result = await collection.insertOne(newProject);
      // Use insertedId instead of ops
      res.status(201).json({ _id: result.insertedId, ...newProject });
    } catch (error) {
      res.status(400).json({ message: "Error creating project", error });
    }
  } else if (req.method === "GET") {
    try {
      const projects = await collection
        .find({ userId: req.query.userId })
        .toArray();
      res.status(200).json(projects);
    } catch (error) {
      res.status(500).json({ message: "Error fetching projects", error });
    }
  } else {
    res.setHeader("Allow", ["GET", "POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
