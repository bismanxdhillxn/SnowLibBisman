import { useEffect, useState } from "react";
// import Sidebar from "../components/Sidebar";
import { Pencil, Trash, Plus } from "lucide-react";

export default function Designations() {
  const [designations, setDesignations] = useState([]);
  const [formData, setFormData] = useState({ title: "" });
  const [editingDesignation, setEditingDesignation] = useState(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    fetchDesignations();
  }, []);

  const fetchDesignations = async () => {
    const response = await fetch("http://localhost:5000/api/designation/");
    const data = await response.json();
    setDesignations(data);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const method = editingDesignation ? "PUT" : "POST";
    const url = editingDesignation
      ? `http://localhost:5000/api/designation/${editingDesignation.id}`
      : "http://localhost:5000/api/designation/";

    await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    fetchDesignations();
    setFormData({ title: "" });
    setEditingDesignation(null);
    setShowForm(false);
  };

  const handleEdit = (designation) => {
    setFormData({ title: designation.title });
    setEditingDesignation(designation);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this designation?")) {
      await fetch(`http://localhost:5000/api/designation/${id}`, {
        method: "DELETE",
      });
      fetchDesignations();
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* <Sidebar /> */}
      <main className="flex-1 mt-20 p-6">
        <header className="bg-white shadow-md p-4 rounded-lg flex justify-between items-center">
          <h1 className="text-lg font-semibold">Designation Management</h1>
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center gap-2"
            onClick={() => setShowForm(true)}
          >
            <Plus size={18} /> Add Designation
          </button>
        </header>

        <div className="mt-6 bg-white p-4 rounded-lg shadow">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-200">
                <th className="p-2">ID</th>
                <th className="p-2">Title</th>
                <th className="p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {designations.map((designation) => (
                <tr key={designation.id} className="border-t">
                  <td className="p-2">{designation.id}</td>
                  <td className="p-2">{designation.title}</td>
                  <td className="p-2 flex gap-2">
                    <button
                      onClick={() => handleEdit(designation)}
                      className="text-blue-500 hover:text-blue-700"
                    >
                      <Pencil size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(designation.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-6 rounded-lg shadow-lg w-96">
              <h2 className="text-xl font-semibold mb-4">
                {editingDesignation ? "Edit Designation" : "Add New Designation"}
              </h2>
              <form onSubmit={handleSubmit}>
                <input
                  type="text"
                  name="title"
                  placeholder="Designation Title"
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full border p-2 rounded mb-2"
                  required
                />
                <div className="flex gap-4 mt-4">
                  <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded">
                    {editingDesignation ? "Update" : "Create"}
                  </button>
                  <button
                    type="button"
                    className="bg-gray-500 text-white px-4 py-2 rounded"
                    onClick={() => {
                      setShowForm(false);
                      setEditingDesignation(null);
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
