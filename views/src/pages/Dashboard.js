import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
// import Sidebar from "../components/Sidebar";

export default function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = sessionStorage.getItem("user");
    if (!storedUser) {
      navigate("/");
    } else {
      setUser(JSON.parse(storedUser));
    }
  }, [navigate]);

  if (!user) return null;

  return (
    <div className="flex h-screen bg-gray-100">
      {/* <Sidebar /> */}
      <main className="flex-1 p-6">
        <header className="bg-white shadow-md p-4 rounded-lg flex justify-between items-center">
          <h1 className="text-lg font-semibold">Welcome, {user.name}</h1>
          <span className="text-gray-600">📅 {new Date().toLocaleDateString()}</span>
        </header>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { title: "Total Users", count: 1500, color: "bg-blue-500" },
            { title: "Active Users", count: 320, color: "bg-green-500" },
            { title: "Pending Requests", count: 45, color: "bg-yellow-500" },
          ].map(({ title, count, color }) => (
            <div key={title} className={`p-6 ${color} text-white rounded-lg shadow-md`}>
              <h3 className="text-lg font-semibold">{title}</h3>
              <p className="text-3xl font-bold">{count}</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
