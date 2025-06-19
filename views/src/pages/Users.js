import { useEffect, useState } from "react";
// import Sidebar from "../components/Sidebar";
import { Pencil, Trash, Plus } from "lucide-react";

export default function Users() {
  const [users, setUsers] = useState([]);
  const [formData, setFormData] = useState({ name: "", email: "", password: "", role_id: 2 });
  const [editingUser, setEditingUser] = useState(null);
  const [showForm, setShowForm] = useState(false);

  // Fetch users from API
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    const response = await fetch("http://localhost:5000/api/auth");
    const data = await response.json();
    console.log(data);
    setUsers(data);
  };

  // Handle Input Change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle Form Submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    const method = editingUser ? "PUT" : "POST";
    const url = editingUser
      ? `http://localhost:5000/api/users/${editingUser.id}`
      : "http://localhost:5000/api/users";

    await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    fetchUsers();
    setFormData({ name: "", email: "", password: "", role_id: 2 });
    setEditingUser(null);
    setShowForm(false);
  };

  // Edit User
  const handleEdit = (user) => {
    setFormData({ 
      name: user.name, 
      email: user.email, 
      password: "", // Keep empty for updates
      role_id: user.role.id 
    });
    setEditingUser(user);
    setShowForm(true);
  };

  // Delete User
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      await fetch(`http://localhost:5000/api/auth/${id}`, { method: "DELETE" });
      fetchUsers();
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* <Sidebar /> */}
      <main className="flex-1 p-6">
        <header className="bg-white shadow-md p-4 rounded-lg flex justify-between items-center">
          <h1 className="text-lg font-semibold">User Management</h1>
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center gap-2"
            onClick={() => setShowForm(true)}
          >
            <Plus size={18} /> Add User
          </button>
        </header>

        {/* User Table */}
        <div className="mt-6 bg-white p-4 rounded-lg shadow">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-200">
                <th className="p-2">Name</th>
                <th className="p-2">Email</th>
                <th className="p-2">Role ID</th>
                <th className="p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="border-t">
                  <td className="p-2">{user.name}</td>
                  <td className="p-2">{user.email}</td>
                  <td className="p-2">{user.role.name}</td>
                  <td className="p-2 flex gap-2">
                    <button
                      onClick={() => handleEdit(user)}
                      className="text-blue-500 hover:text-blue-700"
                    >
                      <Pencil size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(user.id)}
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

        {/* User Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-6 rounded-lg shadow-lg w-96">
              <h2 className="text-xl font-semibold mb-4">
                {editingUser ? "Edit User" : "Add New User"}
              </h2>
              <form onSubmit={handleSubmit}>
                <input
                  type="text"
                  name="name"
                  placeholder="Name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full border p-2 rounded mb-2"
                  required
                />
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full border p-2 rounded mb-2"
                  required
                />
                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full border p-2 rounded mb-2"
                  required={!editingUser}
                />
                <select
                  name="role_id"
                  value={formData.role_id}
                  onChange={handleChange}
                  className="w-full border p-2 rounded mb-2"
                >
                  <option value={1}>Admin</option>
                  <option value={2}>User</option>
                </select>

                <div className="flex gap-4 mt-4">
                  <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded">
                    {editingUser ? "Update" : "Create"}
                  </button>
                  <button
                    type="button"
                    className="bg-gray-500 text-white px-4 py-2 rounded"
                    onClick={() => {
                      setShowForm(false);
                      setEditingUser(null);
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
