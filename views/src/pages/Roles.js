import { useEffect, useState } from "react";
// import Sidebar from "../components/Sidebar"; // Import your sidebar component

export default function Roles() {
  const [roles, setRoles] = useState([]);
  const [name, setName] = useState("");
  const [editingRole, setEditingRole] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchRoles();
  }, []);

  const fetchRoles = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/roles");
      const data = await response.json();
      setRoles(data);
    } catch (error) {
      console.error("Error fetching roles:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setError("Role name is required.");
      return;
    }

    try {
      let response;
      if (editingRole) {
        response = await fetch(`http://localhost:5000/api/roles/${editingRole.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name }),
        });
      } else {
        response = await fetch("http://localhost:5000/api/roles", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name }),
        });
      }

      if (response.ok) {
        setName("");
        setEditingRole(null);
        setError("");
        fetchRoles();
      } else {
        setError("Failed to save role.");
      }
    } catch (error) {
      console.error("Error saving role:", error);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this role?")) return;

    try {
      const response = await fetch(`http://localhost:5000/api/roles/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        fetchRoles();
      } else {
        console.error("Error deleting role");
      }
    } catch (error) {
      console.error("Error deleting role:", error);
    }
  };

  const handleEdit = (role) => {
    setEditingRole(role);
    setName(role.name);
    setError("");
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* <Sidebar /> */}

      {/* Main Content */}
      <main className="flex-1 mt-20 p-6">
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">{editingRole ? "Edit Role" : "Add New Role"}</h2>

          {error && <div className="bg-red-200 text-red-700 p-3 rounded mb-4">{error}</div>}

          <form onSubmit={handleSubmit} className="mb-6">
            <div className="mb-4">
              <input
                type="text"
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter role name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600">
              {editingRole ? "Update Role" : "Add Role"}
            </button>
            {editingRole && (
              <button
                type="button"
                className="ml-2 bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
                onClick={() => {
                  setEditingRole(null);
                  setName("");
                }}
              >
                Cancel
              </button>
            )}
          </form>

          <h4 className="text-lg font-semibold mb-3">Roles List</h4>
          <div className="overflow-x-auto">
            <table className="w-full border border-gray-300 rounded-lg">
              <thead>
                <tr className="bg-gray-200">
                  <th className="p-3 text-left">ID</th>
                  <th className="p-3 text-left">Name</th>
                  <th className="p-3 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {roles.map((role) => (
                  <tr key={role.id} className="border-t">
                    <td className="p-3">{role.id}</td>
                    <td className="p-3">{role.name}</td>
                    <td className="p-3">
                      <button
                        className="bg-yellow-500 text-white px-3 py-1 rounded-lg hover:bg-yellow-600 mr-2"
                        onClick={() => handleEdit(role)}
                      >
                        Edit
                      </button>
                      <button
                        className="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600"
                        onClick={() => handleDelete(role.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
