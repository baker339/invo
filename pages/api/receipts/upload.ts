import formidable, { Fields, Files } from "formidable";
import fs from "fs";
import path from "path";
import { NextApiRequest, NextApiResponse } from "next";
import Tesseract from "tesseract.js"; // Import Tesseract for OCR
import { ReceiptItem } from "@/models/receiptItem";

export const config = {
  api: {
    bodyParser: false, // Disables the default body parser
  },
};

const parseReceipt = async (filePath: string): Promise<ReceiptItem[]> => {
  const {
    data: { text },
  } = await Tesseract.recognize(filePath, "eng", {
    logger: (m) => console.log(m), // Log progress
  });

  // Logic to parse the text into structured data
  const items: ReceiptItem[] = []; // Initialize an empty array for parsed items

  // Assuming text has lines of item data in a structured format
  const lines = text.split("\n");
  lines.forEach((line) => {
    const parts = line.split(" "); // Split by space, customize as necessary
    if (parts.length >= 3) {
      items.push({
        description: parts.slice(0, -2).join(" "), // Join all but the last two parts for description
        quantity: parseFloat(parts[parts.length - 2]),
        unitPrice: parseFloat(parts[parts.length - 1]),
        total:
          parseFloat(parts[parts.length - 2]) *
          parseFloat(parts[parts.length - 1]), // Calculate total
      });
    }
  });

  return items; // Return the structured data
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const form = formidable({
    multiples: false,
    uploadDir: "/tmp", // or another suitable temporary directory
    keepExtensions: true,
  });

  form.parse(req, async (err: Error | null, fields: Fields, files: Files) => {
    if (err) {
      console.error("Error parsing the file:", err);
      return res.status(500).json({ error: "Error parsing the file" });
    }

    if (!files.file || !Array.isArray(files.file) || files.file.length === 0) {
      return res
        .status(400)
        .json({ error: "No file uploaded or invalid file." });
    }

    const uploadedFile = files.file[0]; // Accessing the first file
    console.log("Uploaded File:", uploadedFile);

    // File path to use for processing
    const filePath = uploadedFile.filepath;

    try {
      // Parse the receipt
      const parsedData = await parseReceipt(filePath);
      console.log("Parsed Data:", parsedData); // Log the parsed data
      // Clean up the uploaded file if necessary
      fs.unlinkSync(filePath); // Remove the file after processing, optional
      res.status(200).json(parsedData); // Return the structured receipt data
    } catch (error) {
      console.error("Error parsing receipt:", error);
      res.status(500).json({ error: "Failed to parse receipt" });
    }
  });
};

export default handler;
