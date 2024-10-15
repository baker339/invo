import vision from "@google-cloud/vision";

export async function parseReceipt(base64Image: string) {
  const client = new vision.ImageAnnotatorClient();

  // Strip the metadata (like `data:image/png;base64,`) from the base64 string
  const imageBase64 = base64Image.split(",")[1];

  // Perform text detection
  const [result] = await client.textDetection({
    image: { content: imageBase64 }, // Pass base64 directly
  });

  // Get the text annotations from the result
  const detections = result?.textAnnotations;

  // Safely check if detections exist before processing
  if (!detections || detections.length === 0) {
    throw new Error("No text detected in the image.");
  }

  // Process detections to itemize, e.g., extract item names, quantities, prices
  return detections.map((detection) => {
    return {
      description: detection.description,
      // Implement item extraction logic from the text if needed
    };
  });
}
