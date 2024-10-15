import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useAuth } from "@/hooks/useAuth";
import { Project } from "@/models/project";
import { ReceiptItem } from "@/models/receiptItem";

export default function UploadReceipt() {
  const { user } = useAuth();
  const [receiptData, setReceiptData] = useState<ReceiptItem[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<string>("");
  const [editedData, setEditedData] = useState<ReceiptItem[]>([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Send file to the backend for extraction
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch("/api/receipts/upload", {
      method: "POST",
      body: formData,
    });
    const data = await response.json();

    if (data) {
      setReceiptData(data); // Extracted data
      setEditedData(data); // Editable version
      console.log({ data });
    }
  };

  const handleSave = async () => {
    if (!user || !selectedProject) return;
    setLoading(true);

    const response = await fetch("/api/receipts/save", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId: user.uid,
        projectId: selectedProject,
        receiptData: editedData,
      }),
    });

    if (response.ok) {
      alert("Receipt saved successfully!");
      router.push("/dashboard"); // Redirect after saving
    } else {
      console.error("Error saving receipt");
    }
    setLoading(false);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number,
    field: keyof ReceiptItem
  ) => {
    const newEditedData = [...editedData];
    newEditedData[index] = {
      ...newEditedData[index],
      [field]: e.target.value,
    };
    setEditedData(newEditedData);
  };

  useEffect(() => {
    // Fetch projects when the component mounts
    const fetchProjects = async () => {
      const response = await fetch("/api/projects"); // Adjust this endpoint as needed
      const projectsData = await response.json();
      setProjects(projectsData);
    };
    fetchProjects();
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-6 bg-background">
      {" "}
      {/* Background color updated */}
      <h1 className="text-3xl font-semibold mb-6 text-primary">
        {" "}
        {/* Primary color for title */}
        Upload and Edit Receipt
      </h1>
      {!receiptData.length && (
        <div>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            className="mb-4 border border-lightNeutral rounded-lg px-4 py-2 text-gray-800"
          />
        </div>
      )}
      {receiptData.length > 0 && (
        <div className="mt-6">
          <h2 className="text-2xl font-semibold mb-4 text-primary">
            {" "}
            {/* Primary color for subtitle */}
            Extracted Receipt Data
          </h2>

          <div className="space-y-4">
            {/* Show extracted and editable data */}
            {editedData.map((item, index) => (
              <div key={index} className="bg-white p-4 rounded-lg shadow">
                {" "}
                {/* Added background and shadow */}
                <label className="block text-sm font-medium text-gray-800">
                  Description
                </label>
                <input
                  type="text"
                  value={item.description}
                  onChange={(e) => handleInputChange(e, index, "description")}
                  className="w-full border border-lightNeutral rounded-lg px-4 py-2 text-gray-800"
                />
                <label className="block text-sm font-medium text-gray-800">
                  Quantity
                </label>
                <input
                  type="number"
                  value={item.quantity}
                  onChange={(e) => handleInputChange(e, index, "quantity")}
                  className="w-full border border-lightNeutral rounded-lg px-4 py-2 text-gray-800"
                />
                <label className="block text-sm font-medium text-gray-800">
                  Unit Price
                </label>
                <input
                  type="number"
                  value={item.unitPrice}
                  onChange={(e) => handleInputChange(e, index, "unitPrice")}
                  className="w-full border border-lightNeutral rounded-lg px-4 py-2 text-gray-800"
                />
                <span className="text-gray-800">Total: {item.total}</span>
                <button
                  onClick={() => {
                    const newEditedData = editedData.filter(
                      (_, i) => i !== index
                    );
                    setEditedData(newEditedData);
                  }}
                  className="mt-2 text-red-600 hover:underline"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>

          {/* Project Assignment */}
          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-800">
              Assign to Project
            </label>
            <select
              value={selectedProject}
              onChange={(e) => setSelectedProject(e.target.value)}
              className="w-full border border-lightNeutral rounded-lg px-4 py-2 text-gray-800"
            >
              <option value="">Select a project</option>
              {projects.map((project) => (
                <option key={project._id.toString()} value={project.name}>
                  {project.name}
                </option>
              ))}
            </select>
          </div>

          {/* Save Button */}
          <button
            onClick={handleSave}
            disabled={loading}
            className="mt-6 w-full bg-primary text-white py-3 rounded-lg hover:bg-indigo-700"
          >
            {loading ? "Saving..." : "Save Receipt"}
          </button>
        </div>
      )}
    </div>
  );
}
