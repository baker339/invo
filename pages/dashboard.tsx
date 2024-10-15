import { useEffect, useState } from "react";
import InvoiceForm from "../components/InvoiceForm";
import TimeEntry from "@/models/timeEntry";
import { Project } from "@/models/project";
import { Client } from "@/models/client";
import { useAuth } from "@/hooks/useAuth";
import SummaryStats from "@/components/SummaryStats";

export default function Dashboard() {
  const [entries, setEntries] = useState<TimeEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    description: "",
    timeSpent: "",
    date: "",
    project: "", // Added for project selection
    client: "", // Added for client selection
  });

  const [isEditing, setIsEditing] = useState(false);
  const [editingEntry, setEditingEntry] = useState<TimeEntry | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const { user } = useAuth();

  const handleEditClick = (entry: TimeEntry) => {
    setEditingEntry(entry);
    setFormData({
      description: entry.description,
      timeSpent: entry.timeSpent.toString(),
      date: new Date(entry.date).toISOString().split("T")[0],
      project: entry.project || "", // Preset project ID for editing
      client: entry.client || "", // Preset client ID for editing
    });
    setIsEditing(true);
  };

  const handleDeleteClick = async (id: string) => {
    const confirmDelete = confirm(
      "Are you sure you want to delete this entry?"
    );
    if (confirmDelete) {
      await fetch(`/api/entries/${id}`, {
        method: "DELETE",
      });

      // Remove the entry from the state
      setEntries(entries.filter((entry) => entry._id !== id));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = isEditing
        ? await fetch(`/api/entries/${editingEntry?._id}`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ ...formData, userId: user?.uid }), // Include projectId and clientId
          })
        : await fetch("/api/entries", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ ...formData, userId: user?.uid }), // Include projectId and clientId
          });

      if (response.ok) {
        if (isEditing) {
          // Update the entries array with the edited entry
          setEntries(
            entries.map((entry) =>
              entry._id === editingEntry?._id
                ? {
                    ...entry,
                    ...formData,
                    timeSpent: Number(formData.timeSpent),
                  }
                : entry
            )
          );
          setIsEditing(false);
          setEditingEntry(null);
        } else {
          const newEntry = await response.json();
          setEntries([newEntry, ...entries]);
        }

        // Clear the form
        setFormData({
          description: "",
          timeSpent: "",
          date: "",
          project: "",
          client: "",
        });
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  const fetchClients = async () => {
    try {
      const res = await fetch(`/api/clients?userId=${user?.uid}`);
      const data = await res.json();
      setClients(data);
    } catch (error) {
      console.error("Error fetching clients:", error);
    }
  };

  const fetchProjects = async () => {
    try {
      const res = await fetch(`/api/projects?userId=${user?.uid}`);
      const data = await res.json();
      setProjects(data);
    } catch (error) {
      console.error("Error fetching projects:", error);
    }
  };

  useEffect(() => {
    fetchClients();
    fetchProjects();
  }, []);

  useEffect(() => {
    const fetchEntries = async () => {
      const fetchedEntries: TimeEntry[] = await fetch(
        `/api/entries?userId=${user?.uid}`
      ).then((res) => res.json());
      setEntries(fetchedEntries);
      setLoading(false);
    };

    fetchEntries();
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  if (loading) {
    return (
      <p className="text-center mt-4 text-darkAccent">Loading entries...</p>
    );
  }

  return (
    <div className="min-h-screen bg-accentLight p-6">
      <div className="max-w-4xl mx-auto bg-white shadow-xl rounded-lg p-6">
        <SummaryStats />
        <h1 className="text-4xl font-semibold text-darkAccent text-center py-6">
          Time Entries
        </h1>

        {/* Time Entry Form */}
        <form onSubmit={handleSubmit} className="mb-8 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium text-darkAccent mb-1"
              >
                Description
              </label>
              <input
                type="text"
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                className="text-darkAccent w-full px-4 py-2 border border-lightGray rounded-lg focus:ring-accentDark focus:border-accentDark"
                required
              />
            </div>

            <div>
              <label
                htmlFor="timeSpent"
                className="block text-sm font-medium text-darkAccent mb-1"
              >
                Time Spent (in minutes)
              </label>
              <input
                type="number"
                id="timeSpent"
                name="timeSpent"
                value={formData.timeSpent}
                onChange={handleInputChange}
                className="text-darkAccent w-full px-4 py-2 border border-lightGray rounded-lg focus:ring-accentDark focus:border-accentDark"
                required
              />
            </div>

            <div>
              <label
                htmlFor="date"
                className="block text-sm font-medium text-darkAccent mb-1"
              >
                Date
              </label>
              <input
                type="date"
                id="date"
                name="date"
                value={formData.date}
                onChange={handleInputChange}
                className="text-darkAccent w-full px-4 py-2 border border-lightGray rounded-lg focus:ring-accentDark focus:border-accentDark"
                required
              />
            </div>

            {/* Project Dropdown */}
            <div>
              <label
                htmlFor="project"
                className="block text-sm font-medium text-darkAccent mb-1"
              >
                Project
              </label>
              <select
                id="project"
                name="project"
                onChange={handleInputChange}
                value={formData.project}
                className="text-darkAccent w-full px-4 py-2 border border-lightGray rounded-lg focus:ring-accentDark focus:border-accentDark"
                required
              >
                <option value="">Select a project</option>
                {projects.map((project) => (
                  <option key={project._id.toString()} value={project.name}>
                    {project.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Client Dropdown */}
            <div>
              <label
                htmlFor="client"
                className="block text-sm font-medium text-darkAccent mb-1"
              >
                Client
              </label>
              <select
                id="client"
                name="client"
                onChange={handleInputChange}
                value={formData.client}
                className="text-darkAccent w-full px-4 py-2 border border-lightGray rounded-lg focus:ring-accentDark focus:border-accentDark"
                required
              >
                <option value="">Select a client</option>
                {clients.map((client) => (
                  <option key={client._id.toString()} value={client.name}>
                    {client.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-primary text-white py-3 rounded-lg hover:bg-secondary transition"
          >
            {isEditing ? "Update Entry" : "Add Entry"}
          </button>
        </form>

        {/* Time Entries Table */}
        <table className="min-w-full table-auto bg-lightGray border-collapse">
          <thead>
            <tr>
              <th className="py-3 px-5 bg-darkAccent text-white text-left">
                Description
              </th>
              <th className="py-3 px-5 bg-darkAccent text-white text-left">
                Time Spent
              </th>
              <th className="py-3 px-5 bg-darkAccent text-white text-left">
                Date
              </th>
              <th className="py-3 px-5 bg-darkAccent text-white text-left">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {entries.map((entry) => (
              <tr key={entry._id.toString()} className="border-t">
                <td className="py-3 px-5 text-darkAccent">
                  {entry.description}
                </td>
                <td className="py-3 px-5 text-darkAccent">{entry.timeSpent}</td>
                <td className="py-3 px-5 text-darkAccent">
                  {new Date(entry.date).toLocaleDateString()}
                </td>
                <td className="py-3 px-5 text-darkAccent space-x-2">
                  <button
                    onClick={() => handleEditClick(entry)}
                    className="bg-accentDark text-white px-3 py-1 rounded-lg hover:bg-darkAccent transition"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteClick(entry._id.toString())}
                    className="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-700 transition"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
