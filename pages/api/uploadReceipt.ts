import { NextApiRequest, NextApiResponse } from "next";
import { parseReceipt } from "@/lib/ocr";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const { receipt } = req.body;

    // Pass the base64-encoded receipt to the parsing function
    const parsedData = await parseReceipt(receipt);

    res.status(200).json(parsedData);
  } else {
    res.status(405).end(); // Method Not Allowed
  }
}
