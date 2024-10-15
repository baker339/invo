import clientPromise from "@/lib/mongodb";
import { NextApiRequest, NextApiResponse } from "next";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const client = await clientPromise;
  const db = client.db("time-tracker"); // Replace with your DB name

  if (req.method === "GET") {
    const { userId } = req.query; // Get userId from query params
    const userProfile = await db.collection("profiles").findOne({ userId });
    return res.status(200).json(userProfile);
  }

  if (req.method === "POST") {
    const { userId, name, email, profilePicture, preferences } = req.body;
    await db
      .collection("profiles")
      .updateOne(
        { userId },
        { $set: { name, email, profilePicture, preferences } },
        { upsert: true }
      );
    return res.status(200).json({ message: "Profile updated successfully." });
  }
  return res.status(405).json({ error: "Method not allowed" });
};

export default handler;
