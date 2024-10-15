import Tesseract, { RecognizeResult } from "tesseract.js";

// Define the structure of the extracted data
export interface ExtractedItem {
  name: string;
  price: number | null;
}

export interface ExtractedData {
  items: ExtractedItem[];
  rawText: string;
}

// Function to extract text from the receipt image
export async function extractTextFromReceipt(
  filePath: string
): Promise<ExtractedData> {
  return new Promise((resolve, reject) => {
    Tesseract.recognize(filePath, "eng", {
      logger: (m) => console.log(m),
    })
      .then(({ data }: RecognizeResult) => {
        const text = data.text;
        const lines = text.split("\n");

        // Process the text to identify items and prices
        const extractedData: ExtractedData = processReceiptText(lines);

        resolve(extractedData);
      })
      .catch((error) => {
        reject(error);
      });
  });
}

// Dummy processing function to extract key details from receipt text
function processReceiptText(lines: string[]): ExtractedData {
  const items: ExtractedItem[] = [];

  lines.forEach((line) => {
    const item: ExtractedItem = {
      name: line.trim(),
      price: extractPrice(line),
    };

    items.push(item);
  });

  return {
    items,
    rawText: lines.join("\n"),
  };
}

// Helper function to extract prices from lines (dummy function for now)
function extractPrice(line: string): number | null {
  const priceRegex = /\d+\.\d{2}/;
  const match = line.match(priceRegex);
  return match ? parseFloat(match[0]) : null;
}
