import {
  Home,
  Users,
  Settings,
  LogOut,
  Book,
  Globe,
  Map,
  Layers,
  UserCheck,
  ShoppingBag,
  CreditCard,
  Menu,
  X
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { toast, Bounce } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'

export default function Sidebar() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  const toggleSidebar = () => {
    if (open) {
      setIsClosing(true);
      setTimeout(() => {
        setOpen(false);
        setIsClosing(false);
      }, 300);
    } else {
      setOpen(true);
    }
  };

  // Close sidebar when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      const sidebar = document.getElementById("sidebar");
      const toggleButton = document.getElementById("sidebar-toggle");
      
      if (open && sidebar && !sidebar.contains(event.target) && !toggleButton.contains(event.target)) {
        toggleSidebar();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  const handleLogout = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });
      const data = await response.json();
      console.log("Logout Response:", data);
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

  const adminLinks = [
    { name: "Dashboard", icon: <Home size={18} />, path: "/dashboard" },
    { name: "Manage Role", icon: <Users size={18} />, path: "/roles" },
    { name: "Publishers", icon: <UserCheck size={18} />, path: "/publishers" },
    { name: "Categories", icon: <Layers size={18} />, path: "/categories" },
    { name: "Books", icon: <Book size={18} />, path: "/books" },
    { name: "Orders", icon: <ShoppingBag size={18} />, path: "/orders" },
    { name: "Payments", icon: <CreditCard size={18} />, path: "/payments" },
    { name: "Countries", icon: <Globe size={18} />, path: "/countries" },
    { name: "States", icon: <Map size={18} />, path: "/states" },
    { name: "Regions", icon: <Map size={18} />, path: "/regions" },
    { name: "Settings", icon: <Settings size={18} />, path: "/settings" },
    { name: "Departments", icon: <Layers size={18} />, path: "/departments" },
    { name: "Designations", icon: <Layers size={18} />, path: "/designations" },
  ];

  const publicLinks = [
    { name: "Home", icon: <Home size={18} />, path: "/" },
    { name: "Books", icon: <Book size={18} />, path: "/prods" },
    { name: "About", icon: <Globe size={18} />, path: "/about" },
    { name: "Contact", icon: <Map size={18} />, path: "/contact" },
    { name: "Cart", icon: <ShoppingBag size={18} />, path: "/cart" },
  ];

  // Styles
  const sidebarStyle = {
    width: '18rem',
    backgroundColor: 'white',
    color: '#1F2937',
    padding: '1.5rem',
    height: '100vh',
    position: 'fixed',
    zIndex: 50,
    top: 0,
    left: 0,
    overflowY: 'auto',
    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    transition: 'transform 0.3s ease-out',
    transform: isClosing ? 'translateX(-100%)' : 'translateX(0)',
    animation: open && !isClosing ? 'slideIn 0.3s ease-out forwards' : ''
  };

  const overlayStyle = {
    position: 'fixed',
    inset: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    zIndex: 40
  };

  const toggleButtonStyle = {
    width: '3rem',
    height: '3rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#4B5563',
    borderRadius: '9999px',
    margin: '0.5rem',
    transition: 'background-color 0.2s',
    outlineOffset: '2px'
  };

  const headerStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '2rem'
  };

  const closeButtonStyle = {
    padding: '0.5rem',
    borderRadius: '9999px',
    transition: 'background-color 0.2s'
  };

  const sectionStyle = {
    marginBottom: '1.5rem'
  };

  const sectionTitleStyle = {
    fontSize: '0.75rem',
    fontWeight: 'bold',
    textTransform: 'uppercase',
    color: '#6B7280',
    marginBottom: '0.75rem',
    paddingLeft: '0.75rem'
  };

  const navStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.25rem'
  };

  const getButtonStyle = (isActive) => ({
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    width: '100%',
    padding: '0.75rem',
    marginBottom: '0.25rem',
    borderRadius: '0.5rem',
    backgroundColor: isActive ? '#EEF2FF' : 'transparent',
    color: isActive ? '#4F46E5' : '#4B5563',
    fontWeight: 500,
    transition: 'all 0.2s',
    textAlign: 'left'
  });

  const iconContainerStyle = {
    color: '#4F46E5',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  };

  const logoutButtonStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    width: '100%',
    padding: '0.75rem',
    marginTop: '2rem',
    borderRadius: '0.5rem',
    color: '#EF4444',
    fontWeight: 500,
    transition: 'all 0.2s'
  };

  // Add the keyframes animation
  useEffect(() => {
    if (!document.getElementById('sidebar-animations')) {
      const styleEl = document.createElement('style');
      styleEl.id = 'sidebar-animations';
      styleEl.innerHTML = `
        @keyframes slideIn {
          from { transform: translateX(-100%); }
          to { transform: translateX(0); }
        }
        @keyframes slideOut {
          from { transform: translateX(0); }
          to { transform: translateX(-100%); }
        }
      `;
      document.head.appendChild(styleEl);
    }
    
    return () => {
      const styleEl = document.getElementById('sidebar-animations');
      if (styleEl) styleEl.remove();
    };
  }, []);

  return (
    <div style={{ position: 'relative' }}>
      {/* Toggle Button */}
      <button
        id="sidebar-toggle"
        onClick={toggleSidebar}
        style={toggleButtonStyle}
        onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#F3F4F6'}
        onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
      >
        {open ? <X size={22} /> : <Menu size={22} />}
      </button>

      {/* Overlay */}
      {open && (
        <div style={overlayStyle} onClick={toggleSidebar} />
      )}

      {/* Sidebar */}
      {(open || isClosing) && (
        <aside id="sidebar" style={sidebarStyle}>
          <div style={headerStyle}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#4F46E5' }}>Admin Panel</h2>
            <button 
              onClick={toggleSidebar}
              style={closeButtonStyle}
              onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#F3F4F6'}
              onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
            >
              <X size={20} />
            </button>
          </div>

          <div>
            <div style={sectionStyle}>
              <p style={sectionTitleStyle}>Management</p>
              <nav style={navStyle}>
                {adminLinks.slice(0, 7).map(({ name, icon, path }) => {
                  const isActive = window.location.pathname === path;
                  return (
                    <button
                      key={name}
                      style={getButtonStyle(isActive)}
                      onClick={() => {
                        navigate(path);
                        toggleSidebar();
                      }}
                      onMouseOver={(e) => {
                        if (!isActive) e.currentTarget.style.backgroundColor = '#F9FAFB';
                      }}
                      onMouseOut={(e) => {
                        if (!isActive) e.currentTarget.style.backgroundColor = 'transparent';
                      }}
                    >
                      <span style={iconContainerStyle}>{icon}</span> {name}
                    </button>
                  );
                })}
              </nav>
            </div>

            <div style={sectionStyle}>
              <p style={sectionTitleStyle}>Configuration</p>
              <nav style={navStyle}>
                {adminLinks.slice(7).map(({ name, icon, path }) => {
                  const isActive = window.location.pathname === path;
                  return (
                    <button
                      key={name}
                      style={getButtonStyle(isActive)}
                      onClick={() => {
                        navigate(path);
                        toggleSidebar();
                      }}
                      onMouseOver={(e) => {
                        if (!isActive) e.currentTarget.style.backgroundColor = '#F9FAFB';
                      }}
                      onMouseOut={(e) => {
                        if (!isActive) e.currentTarget.style.backgroundColor = 'transparent';
                      }}
                    >
                      <span style={iconContainerStyle}>{icon}</span> {name}
                    </button>
                  );
                })}
              </nav>
            </div>

            {/* Public links for small screens only */}
            <div style={{ ...sectionStyle, display: window.innerWidth < 768 ? 'block' : 'none' }}>
              <p style={sectionTitleStyle}>Navigation</p>
              <nav style={navStyle}>
                {publicLinks.map(({ name, icon, path }) => {
                  const isActive = window.location.pathname === path;
                  return (
                    <button
                      key={name}
                      style={getButtonStyle(isActive)}
                      onClick={() => {
                        navigate(path);
                        toggleSidebar();
                      }}
                      onMouseOver={(e) => {
                        if (!isActive) e.currentTarget.style.backgroundColor = '#F9FAFB';
                      }}
                      onMouseOut={(e) => {
                        if (!isActive) e.currentTarget.style.backgroundColor = 'transparent';
                      }}
                    >
                      <span style={iconContainerStyle}>{icon}</span> {name}
                    </button>
                  );
                })}
              </nav>
            </div>
          </div>

          <button
            onClick={handleLogout}
            style={logoutButtonStyle}
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = '#EF4444';
              e.currentTarget.style.color = 'white';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.color = '#EF4444';
            }}
          >
            <LogOut size={18} /> Logout
          </button>
        </aside>
      )}
    </div>
  );
}