import { useState } from "react";

export default function UploadReceipt() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);

      // Show image preview
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result as string);
      reader.readAsDataURL(selectedFile); // Convert file to base64
    }
  };

  const handleSubmit = async () => {
    if (file) {
      // Convert the file to base64
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64String = reader.result as string;

        // Send the base64 string to the server
        const res = await fetch("/api/uploadReceipt", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ receipt: base64String }),
        });

        const parsedData = await res.json();
        // Handle the parsed receipt data
        console.log(parsedData);
      };

      reader.readAsDataURL(file); // Read the file as base64
    }
  };

  return (
    <div>
      <input type="file" accept="image/*" onChange={handleFileChange} />
      {preview && <img src={preview} alt="Receipt preview" />}
      <button onClick={handleSubmit}>Upload Receipt</button>
    </div>
  );
}
