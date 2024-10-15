import { NextApiRequest, NextApiResponse } from "next";
import clientPromise from "../../lib/mongodb";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const client = await clientPromise;
    const db = client.db("time-tracker");
    const { userId } = req.query; // Retrieve the userId from query params

    const totalTime = await db
      .collection("entries")
      .aggregate([
        { $match: { userId } },
        { $group: { _id: null, total: { $sum: "$timeSpent" } } },
      ])
      .toArray();

    const activeProjects = await db
      .collection("projects")
      .countDocuments({ userId });
    const totalEarnings = await db
      .collection("entries")
      .aggregate([
        { $match: { userId } },
        { $group: { _id: null, total: { $sum: "$earnings" } } },
      ])
      .toArray();

    const clientCount = await db
      .collection("clients")
      .countDocuments({ userId });

    res.status(200).json({
      totalTime: totalTime[0]?.total || 0,
      activeProjects,
      totalEarnings: totalEarnings[0]?.total || 0,
      clientCount,
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching stats", error });
  }
}
