import { useEffect, useState } from "react";
// import Sidebar from "../components/Sidebar";
import { Pencil, Trash, Plus } from "lucide-react";

export default function Publishers() {
  const [publishers, setPublishers] = useState([]);
  const [formData, setFormData] = useState({ name: "" });
  const [editingPublisher, setEditingPublisher] = useState(null);
  const [showForm, setShowForm] = useState(false);

  // Fetch publishers from API
  useEffect(() => {
    fetchPublishers();
  }, []);

  const fetchPublishers = async () => {
    const response = await fetch("http://localhost:5000/api/publishers/");
    const data = await response.json();
    console.log(data);
    setPublishers(data);
  };

  // Handle Input Change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle Form Submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    const method = editingPublisher ? "PUT" : "POST";
    const url = editingPublisher
      ? `http://localhost:5000/api/publishers/${editingPublisher.id}`
      : "http://localhost:5000/api/publishers/";

    await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    fetchPublishers();
    setFormData({ name: "" });
    setEditingPublisher(null);
    setShowForm(false);
  };

  // Edit Publisher
  const handleEdit = (publisher) => {
    setFormData({ name: publisher.name });
    setEditingPublisher(publisher);
    setShowForm(true);
  };

  // Delete Publisher
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this publisher?")) {
      await fetch(`http://localhost:5000/api/publishers/${id}`, { method: "DELETE" });
      fetchPublishers();
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* <Sidebar /> */}
      <main className="flex-1 mt-20 p-6">
        <header className="bg-white shadow-md p-4 rounded-lg flex justify-between items-center">
          <h1 className="text-lg font-semibold">Publisher Management</h1>
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center gap-2"
            onClick={() => setShowForm(true)}
          >
            <Plus size={18} /> Add Publisher
          </button>
        </header>

        {/* Publisher Table */}
        <div className="mt-6 bg-white p-4 rounded-lg shadow">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-200">
                <th className="p-2">ID</th>
                <th className="p-2">Name</th>
                <th className="p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {publishers.map((publisher) => (
                <tr key={publisher.id} className="border-t">
                  <td className="p-2">{publisher.id}</td>
                  <td className="p-2">{publisher.name}</td>
                  <td className="p-2 flex gap-2">
                    <button
                      onClick={() => handleEdit(publisher)}
                      className="text-blue-500 hover:text-blue-700"
                    >
                      <Pencil size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(publisher.id)}
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

        {/* Publisher Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-6 rounded-lg shadow-lg w-96">
              <h2 className="text-xl font-semibold mb-4">
                {editingPublisher ? "Edit Publisher" : "Add New Publisher"}
              </h2>
              <form onSubmit={handleSubmit}>
                <input
                  type="text"
                  name="name"
                  placeholder="Publisher Name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full border p-2 rounded mb-2"
                  required
                />

                <div className="flex gap-4 mt-4">
                  <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded">
                    {editingPublisher ? "Update" : "Create"}
                  </button>
                  <button
                    type="button"
                    className="bg-gray-500 text-white px-4 py-2 rounded"
                    onClick={() => {
                      setShowForm(false);
                      setEditingPublisher(null);
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
