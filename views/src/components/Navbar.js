import { useEffect, useState } from "react";
import { ShoppingCart, User } from "lucide-react";
import { NavLink } from "react-router-dom";
import Sidebar1 from "../components/Sidebar1";
import Sidebar from "../components/Sidebar";

export default function Navbar() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/auth/check-auth", {
          method: "POST",
          credentials: "include",
        });
        if (res.ok) {
          const data = await res.json();
          setUser(data.user);
        }
      } catch (err) {
        console.error("User check failed:", err);
      }
    };

    fetchUser();
  }, []);

  // Determine if the logged-in user is an admin
  const isAdmin = user && user.roleId === 1;

  // Updated Square Logo component with outline only
  const SquareLogo = () => (
    <div style={{transform: 'rotate(45deg)'}} className="relative w-8 h-8 mr-3 border-2 border-black">
      <svg 
        width="24" 
        height="24" 
        viewBox="0 0 24 24" 
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
        fill="none" 
        stroke="black" 
        strokeWidth="1.5" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      >
        {/* 8 lines forming a snowflake */}
        <line x1="12" y1="2" x2="12" y2="22"></line>
        <line x1="2" y1="12" x2="22" y2="12"></line>
        <line x1="4.93" y1="4.93" x2="19.07" y2="19.07"></line>
        <line x1="19.07" y1="4.93" x2="4.93" y2="19.07"></line>
        <line x1="7.5" y1="2.5" x2="16.5" y2="21.5"></line>
        <line x1="16.5" y1="2.5" x2="7.5" y2="21.5"></line>
        <line x1="2.5" y1="7.5" x2="21.5" y2="16.5"></line>
        <line x1="2.5" y1="16.5" x2="21.5" y2="7.5"></line>
      </svg>
    </div>
  );

  // Improved Link styling for main navigation
  const linkClass = ({ isActive }) =>
    isActive
      ? "text-blue-700 font-semibold px-4 py-2 rounded-lg bg-blue-50 transition-all duration-200 flex items-center"
      : "text-gray-700 hover:text-blue-600 hover:bg-gray-100 px-4 py-2 rounded-lg transition-all duration-200 flex items-center";

  return (
    <nav className="bg-white/60 fixed w-full shadow-md z-20 px-6 py-4">
      {/* Three-part layout with max width container */}
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Left side: logo and conditional sidebar - keeping original structure */}
        <div className="flex items-center gap-2">
          {/* For admin users, render the admin Sidebar; otherwise, render Sidebar1 */}
          {isAdmin ? <Sidebar /> : <Sidebar1 />}
          
          {/* Logo + Site Name */}
          <div className="flex items-center">
            <SquareLogo />
            <div className="text-2xl font-bold" style={{
              background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              SnowLib
            </div>
          </div>
        </div>

        {/* Center: Main navigation - improved with better button styling */}
        <div className="hidden md:flex items-center justify-center flex-1">
          <div className="flex gap-2">
            <NavLink to="/" className={linkClass}>
              Home
            </NavLink>
            <NavLink to="/prods" className={linkClass}>
              Books
            </NavLink>
            <NavLink to="/contact" className={linkClass}>
              Contact
            </NavLink>
          </div>
        </div>

        {/* Right: User actions - improved button styling */}
        <div className="flex items-center gap-2">
          {/* Cart with notification badge */}
          <NavLink to="/cart" className="relative p-3 mr-10 hover:bg-gray-100 rounded-lg transition-all duration-200">
            <ShoppingCart size={20} className="text-gray-700 hover:text-blue-600" />

          </NavLink>
          
          {/* User account/login - improved button */}
          <NavLink to={user ? "/account" : "/login"} className={({ isActive }) => 
            isActive 
              ? "bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center transition-all duration-200" 
              : "bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-2 rounded-lg flex items-center transition-all duration-200"
          }>
            <User size={18} className="mr-2" /> 
            <span className="hidden md:inline">{user ? user.name : "Login"}</span>
          </NavLink>
        </div>
      </div>
    </nav>
  );
}