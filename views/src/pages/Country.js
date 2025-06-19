import { useEffect, useState } from "react";
// import Sidebar from "../components/Sidebar";
import { Pencil, Trash, Plus } from "lucide-react";

export default function Countries() {
  const [countries, setCountries] = useState([]);
  const [formData, setFormData] = useState({ name: "" });
  const [editingCountry, setEditingCountry] = useState(null);
  const [showForm, setShowForm] = useState(false);

  // Fetch countries from API
  useEffect(() => {
    fetchCountries();
  }, []);

  const fetchCountries = async () => {
    const response = await fetch("http://localhost:5000/api/locations/countries/");
    const data = await response.json();
    setCountries(data);
  };

  // Handle Input Change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle Form Submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    const method = editingCountry ? "PUT" : "POST";
    const url = editingCountry
      ? `http://localhost:5000/api/locations/countries/${editingCountry.id}`
      : "http://localhost:5000/api/locations/countries/";

    await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    fetchCountries();
    setFormData({ name: "" });
    setEditingCountry(null);
    setShowForm(false);
  };

  // Edit Country
  const handleEdit = (country) => {
    setFormData({ name: country.name });
    setEditingCountry(country);
    setShowForm(true);
  };

  // Delete Country
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this country?")) {
      await fetch(`http://localhost:5000/api/locations/countries/${id}`, { method: "DELETE" });
      fetchCountries();
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* <Sidebar /> */}
      <main className="flex-1 mt-20 p-6">
        <header className="bg-white shadow-md p-4 rounded-lg flex justify-between items-center">
          <h1 className="text-lg font-semibold">Country Management</h1>
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center gap-2"
            onClick={() => setShowForm(true)}
          >
            <Plus size={18} /> Add Country
          </button>
        </header>

        {/* Country Table */}
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
              {countries.map((country) => (
                <tr key={country.id} className="border-t">
                  <td className="p-2">{country.id}</td>
                  <td className="p-2">{country.name}</td>
                  <td className="p-2 flex gap-2">
                    <button
                      onClick={() => handleEdit(country)}
                      className="text-blue-500 hover:text-blue-700"
                    >
                      <Pencil size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(country.id)}
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

        {/* Country Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-6 rounded-lg shadow-lg w-96">
              <h2 className="text-xl font-semibold mb-4">
                {editingCountry ? "Edit Country" : "Add New Country"}
              </h2>
              <form onSubmit={handleSubmit}>
                <input
                  type="text"
                  name="name"
                  placeholder="Country Name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full border p-2 rounded mb-2"
                  required
                />

                <div className="flex gap-4 mt-4">
                  <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded">
                    {editingCountry ? "Update" : "Create"}
                  </button>
                  <button
                    type="button"
                    className="bg-gray-500 text-white px-4 py-2 rounded"
                    onClick={() => {
                      setShowForm(false);
                      setEditingCountry(null);
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
