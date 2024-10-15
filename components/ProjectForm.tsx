import { useState } from "react";

interface ProjectFormProps {
  onProjectAdded: () => void; // Callback to refresh the project list after adding
}

const ProjectForm: React.FC<ProjectFormProps> = ({ onProjectAdded }) => {
  const [projectName, setProjectName] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const response = await fetch("/api/projects", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: projectName }),
      });

      if (response.ok) {
        setProjectName(""); // Clear input after submission
        onProjectAdded(); // Refresh project list or show confirmation
      } else {
        console.error("Error adding project");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="p-4 border border-gray-300 rounded-lg"
    >
      <h2 className="text-lg font-bold mb-2">Add Project</h2>
      <div className="mb-4">
        <label className="block mb-1">Project Name</label>
        <input
          type="text"
          value={projectName}
          onChange={(e) => setProjectName(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg"
          required
        />
      </div>
      <button
        type="submit"
        className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600"
      >
        Add Project
      </button>
    </form>
  );
};

export default ProjectForm;
