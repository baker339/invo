import { NextApiRequest, NextApiResponse } from "next";
import clientPromise from "@/lib/mongodb";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const client = await clientPromise;
  const db = client.db("time-tracker"); // Replace with your actual database name
  const collection = db.collection("clients");

  if (req.method === "POST") {
    try {
      const newClient = {
        name: req.body.name,
        userId: req.body.userId,
      };
      const result = await collection.insertOne(newClient);
      // Use insertedId instead of ops
      res.status(201).json({ _id: result.insertedId, ...newClient });
    } catch (error) {
      res.status(400).json({ message: "Error creating client", error });
    }
  } else if (req.method === "GET") {
    try {
      const clients = await collection
        .find({ userId: req.query.userId })
        .toArray();
      res.status(200).json(clients);
    } catch (error) {
      res.status(500).json({ message: "Error fetching clients", error });
    }
  } else {
    res.setHeader("Allow", ["GET", "POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
