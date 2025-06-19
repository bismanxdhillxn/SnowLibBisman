import { useEffect, useState } from "react";
// import Sidebar from "../components/Sidebar";
import { Pencil, Trash, Plus } from "lucide-react";
import { toast, Bounce } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function Departments() {
  const [departments, setDepartments] = useState([]);
  const [formData, setFormData] = useState({ name: "" });
  const [editingDepartment, setEditingDepartment] = useState(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    const response = await fetch("http://localhost:5000/api/department/");
    const data = await response.json();
    setDepartments(data);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      toast.warning('Department name is required!', {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: false,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "dark",
                    transition: Bounce,
                  });
      return;
    }
  
    const method = editingDepartment ? "PUT" : "POST";
    const url = editingDepartment
      ? `http://localhost:5000/api/department/${editingDepartment.id}`
      : `http://localhost:5000/api/department/`;
  
    await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });
  
    fetchDepartments();
    setFormData({ name: "" });
    setEditingDepartment(null);
    setShowForm(false);
  };
  

  const handleEdit = (department) => {
    setFormData({ name: department.name });
    setEditingDepartment(department);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this department?")) {
      await fetch(`http://localhost:5000/api/department/${id}`, {
        method: "DELETE",
      });
      fetchDepartments();
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* <Sidebar /> */}
      <main className="flex-1 mt-20 p-6">
        <header className="bg-white shadow-md p-4 rounded-lg flex justify-between items-center">
          <h1 className="text-lg font-semibold">Department Management</h1>
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center gap-2"
            onClick={() => setShowForm(true)}
          >
            <Plus size={18} /> Add Department
          </button>
        </header>

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
              {departments.map((department) => (
                <tr key={department.id} className="border-t">
                  <td className="p-2">{department.id}</td>
                  <td className="p-2">{department.name}</td>
                  <td className="p-2 flex gap-2">
                    <button
                      onClick={() => handleEdit(department)}
                      className="text-blue-500 hover:text-blue-700"
                    >
                      <Pencil size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(department.id)}
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
                {editingDepartment ? "Edit Department" : "Add New Department"}
              </h2>
              <form onSubmit={handleSubmit}>
              <input
                type="text"
                name="name" // 🔥 Ensure this matches the model field
                placeholder="Department Name"
                value={formData.name}
                onChange={handleChange}
                className="w-full border p-2 rounded mb-2"
                required
              />

                <div className="flex gap-4 mt-4">
                  <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded">
                    {editingDepartment ? "Update" : "Create"}
                  </button>
                  <button
                    type="button"
                    className="bg-gray-500 text-white px-4 py-2 rounded"
                    onClick={() => {
                      setShowForm(false);
                      setEditingDepartment(null);
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
