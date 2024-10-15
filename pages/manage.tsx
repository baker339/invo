import React, { useEffect, useState } from "react";
import Project, { Project as ProjectType } from "@/models/project";
import Client, { Client as ClientType } from "@/models/client";
import { useAuth } from "@/hooks/useAuth";

const ManageProjectsAndClients: React.FC = () => {
  // State for projects
  const [projects, setProjects] = useState<ProjectType[]>([]);
  const [editProject, setEditProject] = useState<ProjectType | null>(null);
  const [newProject, setNewProject] = useState<{
    name: string;
    description?: string;
  }>({
    name: "",
    description: "",
  });

  // State for clients
  const [clients, setClients] = useState<ClientType[]>([]);
  const [editClient, setEditClient] = useState<ClientType | null>(null);
  const [newClient, setNewClient] = useState<{
    name: string;
    contactInfo?: string;
  }>({
    name: "",
    contactInfo: "",
  });
  const { user } = useAuth();

  // Fetch projects and clients
  useEffect(() => {
    const fetchProjectsAndClients = async () => {
      const [projectsRes, clientsRes] = await Promise.all([
        fetch(`/api/projects?userId=${user?.uid}`),
        fetch(`/api/clients?userId=${user?.uid}`),
      ]);
      const [projectsData, clientsData] = await Promise.all([
        projectsRes.json(),
        clientsRes.json(),
      ]);
      setProjects(projectsData);
      setClients(clientsData);
    };

    fetchProjectsAndClients();
  }, [user]);

  // Handle project form submission
  const handleProjectSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const projectData = {
      name: newProject.name,
      description: newProject.description,
    };

    if (editProject) {
      const response = await fetch(`/api/projects/${editProject._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(projectData),
      });
      const updatedProject = await response.json();
      setProjects((prev) =>
        prev.map((project) =>
          project._id === updatedProject._id ? updatedProject : project
        )
      );
    } else {
      const response = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...projectData, userId: user?.uid }),
      });
      const newProj = await response.json();
      setProjects((prev) => [...prev, newProj]);
    }

    // Clear form
    setEditProject(null);
    setNewProject({ name: "", description: "" });
  };

  // Handle client form submission
  const handleClientSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const clientData = {
      name: newClient.name,
      contactInfo: newClient.contactInfo,
    };

    if (editClient) {
      const response = await fetch(`/api/clients/${editClient._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(clientData),
      });
      const updatedClient = await response.json();
      setClients((prev) =>
        prev.map((client) =>
          client._id === updatedClient._id ? updatedClient : client
        )
      );
    } else {
      const response = await fetch("/api/clients", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...clientData, userId: user?.uid }),
      });
      const newC = await response.json();
      setClients((prev) => [...prev, newC]);
    }

    // Clear form
    setEditClient(null);
    setNewClient({ name: "", contactInfo: "" });
  };

  // Delete project
  const handleDeleteProject = async (projectId: string) => {
    const response = await fetch(`/api/projects/${projectId}`, {
      method: "DELETE",
    });
    if (response.ok) {
      setProjects((prev) =>
        prev.filter((project) => project._id.toString() !== projectId)
      );
    }
  };

  // Delete client
  const handleDeleteClient = async (clientId: string) => {
    const response = await fetch(`/api/clients/${clientId}`, {
      method: "DELETE",
    });
    if (response.ok) {
      setClients((prev) =>
        prev.filter((client) => client._id.toString() !== clientId)
      );
    }
  };

  return (
    <div className="container mx-auto p-6 bg-background rounded-lg shadow-lg">
      <h1 className="text-3xl font-bold text-center text-neutral mb-8">
        Manage Projects and Clients
      </h1>

      {/* Project Form */}
      <div className="mb-10">
        <h2 className="text-2xl font-semibold text-neutral mb-4">Projects</h2>
        <form onSubmit={handleProjectSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Project Name"
            value={newProject.name}
            onChange={(e) =>
              setNewProject({ ...newProject, name: e.target.value })
            }
            required
            className="w-full p-3 border border-lightNeutral rounded-lg text-neutral"
          />
          <textarea
            placeholder="Description"
            value={newProject.description}
            onChange={(e) =>
              setNewProject({ ...newProject, description: e.target.value })
            }
            className="w-full p-3 border border-lightNeutral rounded-lg text-neutral"
          />
          <button
            type="submit"
            className="bg-primary text-background py-2 px-6 rounded-lg hover:bg-secondary transition"
          >
            {editProject ? "Update" : "Create"} Project
          </button>
        </form>

        <ul className="mt-6 space-y-4">
          {projects.map((project) => (
            <li
              key={project._id.toString()}
              className="bg-lightNeutral p-4 rounded-lg shadow-md flex justify-between items-center dark:bg-darkAccent"
            >
              <div>
                <span className="text-lg font-semibold text-neutral">
                  {project.name}
                </span>
                <p className="text-neutral">{project.description}</p>
              </div>
              <div className="flex space-x-4">
                <button
                  onClick={() => setEditProject(project)}
                  className="text-sm bg-accentLight text-neutral px-4 py-2 rounded-lg hover:bg-accentDark"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteProject(project._id.toString())}
                  className="text-sm bg-red-600 text-background px-4 py-2 rounded-lg hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Client Form */}
      <div>
        <h2 className="text-2xl font-semibold text-neutral mb-4">Clients</h2>
        <form onSubmit={handleClientSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Client Name"
            value={newClient.name}
            onChange={(e) =>
              setNewClient({ ...newClient, name: e.target.value })
            }
            required
            className="w-full p-3 border border-lightNeutral rounded-lg text-neutral"
          />
          <input
            type="text"
            placeholder="Contact Info"
            value={newClient.contactInfo}
            onChange={(e) =>
              setNewClient({ ...newClient, contactInfo: e.target.value })
            }
            className="w-full p-3 border border-lightNeutral rounded-lg text-neutral"
          />
          <button
            type="submit"
            className="bg-primary text-background py-2 px-6 rounded-lg hover:bg-secondary transition"
          >
            {editClient ? "Update" : "Create"} Client
          </button>
        </form>

        <ul className="mt-6 space-y-4">
          {clients.map((client) => (
            <li
              key={client._id.toString()}
              className="bg-lightNeutral p-4 rounded-lg shadow-md flex justify-between items-center dark:bg-darkAccent"
            >
              <div>
                <span className="text-lg font-semibold text-neutral">
                  {client.name}
                </span>
                <p className="text-neutral">{client.contactInfo}</p>
              </div>
              <div className="flex space-x-4">
                <button
                  onClick={() => setEditClient(client)}
                  className="text-sm bg-accentLight text-neutral px-4 py-2 rounded-lg hover:bg-accentDark"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteClient(client._id.toString())}
                  className="text-sm bg-red-600 text-background px-4 py-2 rounded-lg hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ManageProjectsAndClients;
