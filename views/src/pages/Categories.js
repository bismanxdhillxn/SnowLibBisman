import { useEffect, useState } from "react";
// import Sidebar from "../components/Sidebar";
import { Pencil, Trash, Plus } from "lucide-react";

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({ name: "" });
  const [editingCategory, setEditingCategory] = useState(null);
  const [showForm, setShowForm] = useState(false);

  // Fetch categories from API
  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    const response = await fetch("http://localhost:5000/api/categories/");
    const data = await response.json();
    setCategories(data);
  };

  // Handle Input Change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle Form Submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    const method = editingCategory ? "PUT" : "POST";
    const url = editingCategory
      ? `http://localhost:5000/api/categories/${editingCategory.id}`
      : "http://localhost:5000/api/categories/";

    await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    fetchCategories();
    setFormData({ name: "" });
    setEditingCategory(null);
    setShowForm(false);
  };

  // Edit Category
  const handleEdit = (category) => {
    setFormData({ name: category.name });
    setEditingCategory(category);
    setShowForm(true);
  };

  // Delete Category
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this category?")) {
      await fetch(`http://localhost:5000/api/categories/${id}`, { method: "DELETE" });
      fetchCategories();
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* <Sidebar /> */}
      <main className="flex-1 mt-20 p-6">
        <header className="bg-white shadow-md p-4 rounded-lg flex justify-between items-center">
          <h1 className="text-lg font-semibold">Category Management</h1>
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center gap-2"
            onClick={() => setShowForm(true)}
          >
            <Plus size={18} /> Add Category
          </button>
        </header>

        {/* Category Table */}
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
              {categories.map((category) => (
                <tr key={category.id} className="border-t">
                  <td className="p-2">{category.id}</td>
                  <td className="p-2">{category.name}</td>
                  <td className="p-2 flex gap-2">
                    <button
                      onClick={() => handleEdit(category)}
                      className="text-blue-500 hover:text-blue-700"
                    >
                      <Pencil size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(category.id)}
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

        {/* Category Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-6 rounded-lg shadow-lg w-96">
              <h2 className="text-xl font-semibold mb-4">
                {editingCategory ? "Edit Category" : "Add New Category"}
              </h2>
              <form onSubmit={handleSubmit}>
                <input
                  type="text"
                  name="name"
                  placeholder="Category Name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full border p-2 rounded mb-2"
                  required
                />

                <div className="flex gap-4 mt-4">
                  <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded">
                    {editingCategory ? "Update" : "Create"}
                  </button>
                  <button
                    type="button"
                    className="bg-gray-500 text-white px-4 py-2 rounded"
                    onClick={() => {
                      setShowForm(false);
                      setEditingCategory(null);
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
