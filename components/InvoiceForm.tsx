import TimeEntry from "@/models/timeEntry";
import { useEffect, useState } from "react";

interface InvoiceData {
  client: string;
  project: string;
  timeEntries: string[]; // Array of selected time entry IDs
  total: number;
  issueDate: string;
  dueDate: string;
  notes?: string;
}

interface InvoiceFormProps {
  entries: TimeEntry[]; // Array of available time entries
  onSubmit: (invoice: InvoiceData) => Promise<void>; // Callback for submitting the invoice
}

const InvoiceForm: React.FC<InvoiceFormProps> = ({ entries, onSubmit }) => {
  const [invoiceData, setInvoiceData] = useState<InvoiceData>({
    client: "",
    project: "",
    timeEntries: [],
    total: 0,
    issueDate: "",
    dueDate: "",
    notes: "",
  });

  const handleInvoiceSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Logic to calculate total from selected time entries
    const selectedEntries = entries.filter((entry) =>
      invoiceData.timeEntries.includes(entry._id)
    );

    // Ensure timeSpent is treated as a number
    const total = selectedEntries.reduce(
      (acc, entry) =>
        acc +
        (typeof entry.timeSpent === "string"
          ? parseInt(entry.timeSpent, 10)
          : entry.timeSpent),
      0
    );

    // Set total in invoiceData
    const newInvoiceData = { ...invoiceData, total };
    setInvoiceData(newInvoiceData);

    try {
      await onSubmit(newInvoiceData);
      setInvoiceData({
        client: "",
        project: "",
        timeEntries: [],
        total: 0,
        issueDate: "",
        dueDate: "",
        notes: "",
      });
    } catch (error) {
      console.error("Error creating invoice:", error);
    }
  };

  const handleInvoiceInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setInvoiceData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInvoiceData((prev) => ({
      ...prev,
      notes: e.target.value,
    }));
  };

  const handleCheckboxChange = (id: string) => {
    setInvoiceData((prev) => {
      const timeEntries = prev.timeEntries.includes(id)
        ? prev.timeEntries.filter((entryId) => entryId !== id)
        : [...prev.timeEntries, id];

      // Recalculate the total based on selected time entries
      const total = timeEntries.reduce((acc, entryId) => {
        const entry = entries.find((entry) => entry._id === entryId);
        return (
          acc +
          (entry
            ? typeof entry.timeSpent === "string"
              ? parseInt(entry.timeSpent, 10)
              : entry.timeSpent
            : 0)
        );
      }, 0);

      return { ...prev, timeEntries, total };
    });
  };

  return (
    <form
      onSubmit={handleInvoiceSubmit}
      className="mt-8 p-8 bg-white rounded-xl shadow-lg space-y-6"
    >
      <h2 className="text-4xl font-semibold text-gray-800 mb-6">
        Generate Invoice
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <label className="block text-gray-600 font-medium mb-1">Client</label>
          <input
            type="text"
            name="client"
            value={invoiceData.client}
            onChange={handleInvoiceInputChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring focus:ring-indigo-200 text-gray-700"
            required
          />
        </div>
        <div>
          <label className="block text-gray-600 font-medium mb-1">
            Project
          </label>
          <input
            type="text"
            name="project"
            value={invoiceData.project}
            onChange={handleInvoiceInputChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring focus:ring-indigo-200 text-gray-700"
            required
          />
        </div>
      </div>

      <div>
        <label className="block text-gray-600 font-medium mb-1">
          Time Entries
        </label>
        <div className="flex flex-col space-y-2">
          {entries.map((entry) => (
            <div key={entry._id} className="flex items-center space-x-3">
              <input
                type="checkbox"
                id={entry._id}
                checked={invoiceData.timeEntries.includes(entry._id)}
                onChange={() => handleCheckboxChange(entry._id)}
                className="h-4 w-4 text-indigo-600 border-gray-300 focus:ring-indigo-500"
              />
              <label htmlFor={entry._id} className="text-gray-700 text-sm">
                {entry.description} - {entry.timeSpent} min
              </label>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <label className="block text-gray-600 font-medium mb-1">Total</label>
          <input
            type="number"
            name="total"
            value={invoiceData.total}
            readOnly
            className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-500"
          />
        </div>
        <div>
          <label className="block text-gray-600 font-medium mb-1">
            Issue Date
          </label>
          <input
            type="date"
            name="issueDate"
            value={invoiceData.issueDate}
            onChange={handleInvoiceInputChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring focus:ring-indigo-200 text-gray-700"
            required
          />
        </div>
        <div>
          <label className="block text-gray-600 font-medium mb-1">
            Due Date
          </label>
          <input
            type="date"
            name="dueDate"
            value={invoiceData.dueDate}
            onChange={handleInvoiceInputChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring focus:ring-indigo-200 text-gray-700"
            required
          />
        </div>
      </div>

      <div>
        <label className="block text-gray-600 font-medium mb-1">Notes</label>
        <textarea
          name="notes"
          value={invoiceData.notes}
          onChange={handleTextareaChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring focus:ring-indigo-200 text-gray-700"
          rows={4}
        ></textarea>
      </div>

      <button
        type="submit"
        className="w-full bg-indigo-600 text-white py-3 px-6 rounded-lg hover:bg-indigo-500 transition duration-300"
      >
        Create Invoice
      </button>
    </form>
  );
};

export default InvoiceForm;
