import { Home, ShoppingCart, User, Settings, LogOut, Book, Heart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast, Bounce } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'

export default function CustomerSidebar() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });

      const data = await response.json();

      if (response.ok) {
        sessionStorage.removeItem("user");
        navigate("/");
      } else {
        toast.error(data.error || 'Logout failed.', {
          position: "top-right",
          autoClose: 2500,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
          transition: Bounce,
          });
      }
    } catch (error) {
      console.error("Logout Error:", error);
      toast.error('An error occurred during logout.', {
        position: "top-right",
        autoClose: 2500,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
        transition: Bounce,
        });
    }
  };

  return (
    <aside className="w-64 bg-gray-800 text-white p-5 h-screen">
      <h2 className="text-xl font-bold mb-5">Customer Panel</h2>
      <nav>
        {[
          { name: "Dashboard", icon: <Home size={18} />, path: "/customers" },
          { name: "Library", icon: <Book size={18} />, path: "/customer-books" },
          { name: "Wishlist", icon: <Heart size={18} />, path: "/customer-wishlist" },
          { name: "Orders", icon: <ShoppingCart size={18} />, path: "/customer-orders" },
          { name: "Profile", icon: <User size={18} />, path: "/customer-profile" },
        ].map(({ name, icon, path }) => (
          <button
            key={name}
            className="flex items-center gap-2 w-full p-2 mb-2 rounded-lg hover:bg-gray-700"
            onClick={() => navigate(path)}
          >
            {icon} {name}
          </button>
        ))}
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 w-full p-2 mt-6 text-red-400 hover:text-white hover:bg-red-500 rounded-lg"
        >
          <LogOut size={18} /> Logout
        </button>
      </nav>
    </aside>
  );
}
