import { useState } from "react";

interface ClientFormProps {
  onClientAdded: () => void; // Callback to refresh the client list after adding
}

const ClientForm: React.FC<ClientFormProps> = ({ onClientAdded }) => {
  const [clientName, setClientName] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const response = await fetch("/api/clients", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: clientName }),
      });

      if (response.ok) {
        setClientName(""); // Clear the input after successful submission
        onClientAdded(); // Refresh client list or show confirmation
      } else {
        console.error("Error adding client");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="p-6 bg-lightBlue rounded-lg shadow-lg mt-6 max-w-md mx-auto"
    >
      <h2 className="text-2xl font-bold text-darkGreen mb-4">Add Client</h2>

      <div className="mb-6">
        <label className="block text-darkBlue font-medium mb-2">
          Client Name
        </label>
        <input
          type="text"
          value={clientName}
          onChange={(e) => setClientName(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-md text-darkBlue bg-white focus:ring-2 focus:ring-lightGreen focus:border-transparent"
          placeholder="Enter client name"
          required
        />
      </div>

      <button
        type="submit"
        className="w-full bg-darkGreen text-white py-2 px-4 rounded-lg hover:bg-lightGreen transition duration-300"
      >
        Add Client
      </button>
    </form>
  );
};

export default ClientForm;
