import { useEffect, useState } from "react";
// import Sidebar from "../components/Sidebar";
import { Pencil, Trash, Plus } from "lucide-react";

export default function Regions() {
  const [regions, setRegions] = useState([]);
  const [countries, setCountries] = useState([]);
  const [formData, setFormData] = useState({ name: "", countryId: "" });
  const [editingRegion, setEditingRegion] = useState(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    fetchRegions();
    fetchCountries();
  }, []);

  const fetchRegions = async () => {
    const response = await fetch("http://localhost:5000/api/locations/regions/");
    const data = await response.json();
    setRegions(data);
  };

  const fetchCountries = async () => {
    const response = await fetch("http://localhost:5000/api/locations/countries/");
    const data = await response.json();
    setCountries(data);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const method = editingRegion ? "PUT" : "POST";
    const url = editingRegion
      ? `http://localhost:5000/api/locations/regions/${editingRegion.id}`
      : "http://localhost:5000/api/locations/regions/";

    await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    fetchRegions();
    setFormData({ name: "", countryId: "" });
    setEditingRegion(null);
    setShowForm(false);
  };

  const handleEdit = (region) => {
    setFormData({ name: region.name, countryId: region.countryId });
    setEditingRegion(region);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this region?")) {
      await fetch(`http://localhost:5000/api/locations/regions/${id}`, { method: "DELETE" });
      fetchRegions();
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* <Sidebar /> */}
      <main className="flex-1 mt-20 p-6">
        <header className="bg-white shadow-md p-4 rounded-lg flex justify-between items-center">
          <h1 className="text-lg font-semibold">Region Management</h1>
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center gap-2"
            onClick={() => setShowForm(true)}
          >
            <Plus size={18} /> Add Region
          </button>
        </header>

        <div className="mt-6 bg-white p-4 rounded-lg shadow">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-200">
                <th className="p-2">ID</th>
                <th className="p-2">Name</th>
                <th className="p-2">Country</th>
                <th className="p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {regions.map((region) => (
                <tr key={region.id} className="border-t">
                  <td className="p-2">{region.id}</td>
                  <td className="p-2">{region.name}</td>
                  <td className="p-2">
                    {countries.find((c) => c.id === region.countryId)?.name || "Unknown"}
                  </td>
                  <td className="p-2 flex gap-2">
                    <button onClick={() => handleEdit(region)} className="text-blue-500 hover:text-blue-700">
                      <Pencil size={16} />
                    </button>
                    <button onClick={() => handleDelete(region.id)} className="text-red-500 hover:text-red-700">
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
              <h2 className="text-xl font-semibold mb-4">{editingRegion ? "Edit Region" : "Add New Region"}</h2>
              <form onSubmit={handleSubmit}>
                <input
                  type="text"
                  name="name"
                  placeholder="Region Name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full border p-2 rounded mb-2"
                  required
                />
                <select
                  name="countryId"
                  value={formData.countryId}
                  onChange={handleChange}
                  className="w-full border p-2 rounded mb-2"
                  required
                >
                  <option value="">Select Country</option>
                  {countries.map((country) => (
                    <option key={country.id} value={country.id}>
                      {country.name}
                    </option>
                  ))}
                </select>

                <div className="flex gap-4 mt-4">
                  <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded">
                    {editingRegion ? "Update" : "Create"}
                  </button>
                  <button
                    type="button"
                    className="bg-gray-500 text-white px-4 py-2 rounded"
                    onClick={() => {
                      setShowForm(false);
                      setEditingRegion(null);
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
