import { useEffect, useState } from "react";
// import Sidebar from "../components/Sidebar";
import { Pencil, Trash, Plus } from "lucide-react";

export default function States() {
  const [states, setStates] = useState([]);
  const [regions, setRegions] = useState([]);
  const [formData, setFormData] = useState({ name: "", regionId: "" });
  const [editingState, setEditingState] = useState(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    fetchStates();
    fetchRegions();
  }, []);

  const fetchStates = async () => {
    const response = await fetch("http://localhost:5000/api/locations/states/");
    const data = await response.json();
    setStates(data);
  };

  const fetchRegions = async () => {
    const response = await fetch("http://localhost:5000/api/locations/regions/");
    const data = await response.json();
    setRegions(data);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const method = editingState ? "PUT" : "POST";
    const url = editingState
      ? `http://localhost:5000/api/locations/states/${editingState.id}`
      : "http://localhost:5000/api/locations/states/";

    await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    fetchStates();
    setFormData({ name: "", regionId: "" });
    setEditingState(null);
    setShowForm(false);
  };

  const handleEdit = (state) => {
    setFormData({ name: state.name, regionId: state.regionId });
    setEditingState(state);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this state?")) {
      await fetch(`http://localhost:5000/api/locations/states/${id}`, { method: "DELETE" });
      fetchStates();
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* <Sidebar /> */}
      <main className="flex-1 mt-20 p-6">
        <header className="bg-white shadow-md p-4 rounded-lg flex justify-between items-center">
          <h1 className="text-lg font-semibold">State Management</h1>
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center gap-2"
            onClick={() => setShowForm(true)}
          >
            <Plus size={18} /> Add State
          </button>
        </header>

        <div className="mt-6 bg-white p-4 rounded-lg shadow">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-200">
                <th className="p-2">ID</th>
                <th className="p-2">Name</th>
                <th className="p-2">Region</th>
                <th className="p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {states.map((state) => (
                <tr key={state.id} className="border-t">
                  <td className="p-2">{state.id}</td>
                  <td className="p-2">{state.name}</td>
                  <td className="p-2">
                    {regions.find((r) => r.id === state.regionId)?.name || "Unknown"}
                  </td>
                  <td className="p-2 flex gap-2">
                    <button onClick={() => handleEdit(state)} className="text-blue-500 hover:text-blue-700">
                      <Pencil size={16} />
                    </button>
                    <button onClick={() => handleDelete(state.id)} className="text-red-500 hover:text-red-700">
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
              <h2 className="text-xl font-semibold mb-4">{editingState ? "Edit State" : "Add New State"}</h2>
              <form onSubmit={handleSubmit}>
                <input
                  type="text"
                  name="name"
                  placeholder="State Name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full border p-2 rounded mb-2"
                  required
                />
                <select
                  name="regionId"
                  value={formData.regionId}
                  onChange={handleChange}
                  className="w-full border p-2 rounded mb-2"
                  required
                >
                  <option value="">Select Region</option>
                  {regions.map((region) => (
                    <option key={region.id} value={region.id}>
                      {region.name}
                    </option>
                  ))}
                </select>

                <div className="flex gap-4 mt-4">
                  <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded">
                    {editingState ? "Update" : "Create"}
                  </button>
                  <button
                    type="button"
                    className="bg-gray-500 text-white px-4 py-2 rounded"
                    onClick={() => {
                      setShowForm(false);
                      setEditingState(null);
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
