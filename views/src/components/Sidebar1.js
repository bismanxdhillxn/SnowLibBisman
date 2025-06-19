import { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { ShoppingCart, Menu, X, Home, Book, Globe, Map } from "lucide-react";

export default function Sidebar1() {
  const [open, setOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  const toggleMenu = () => {
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
      const sidebar = document.getElementById("mobile-sidebar");
      const toggleButton = document.getElementById("mobile-sidebar-toggle");
      
      if (open && sidebar && !sidebar.contains(event.target) && !toggleButton.contains(event.target)) {
        toggleMenu();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

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

  // Styles
  const sidebarStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    zIndex: 50,
    width: '16rem',
    height: '100vh',
    backgroundColor: 'white',
    padding: '1.5rem',
    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    borderRight: '1px solid #E5E7EB',
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
    width: '2.5rem',
    height: '2.5rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#1F2937',
    borderRadius: '0.375rem',
    transition: 'background-color 0.2s'
  };

  const headerStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '1.5rem'
  };

  const navListStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem'
  };

  const getLinkStyle = (isActive) => ({
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '0.75rem 1rem',
    borderRadius: '0.375rem',
    backgroundColor: isActive ? '#F3F4F6' : 'transparent',
    color: isActive ? '#4F46E5' : '#1F2937',
    fontWeight: isActive ? 500 : 400,
    transition: 'all 0.2s'
  });

  // Navigation links with icons
  const navLinks = [
    { path: "/", text: "Home", icon: <Home size={18} /> },
    { path: "/prods", text: "Books", icon: <Book size={18} /> },
    { path: "/about", text: "About", icon: <Globe size={18} /> },
    { path: "/contact", text: "Contact", icon: <Map size={18} /> },
    { path: "/cart", text: "Cart", icon: <ShoppingCart size={18} /> }
  ];

  return (
    <div style={{ position: 'relative' }} className="md:hidden">
      {/* Toggle Button */}
      <button
        id="mobile-sidebar-toggle"
        onClick={toggleMenu}
        style={toggleButtonStyle}
        onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#F3F4F6'}
        onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
      >
        {open ? <X size={22} /> : <Menu size={22} />}
      </button>

      {/* Overlay */}
      {open && (
        <div style={overlayStyle} onClick={toggleMenu} />
      )}

      {/* Sidebar */}
      {(open || isClosing) && (
        <aside id="mobile-sidebar" style={sidebarStyle}>
          <div style={headerStyle}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#4F46E5' }}>Navigation</h2>
            <button 
              onClick={toggleMenu}
              style={{
                padding: '0.5rem',
                borderRadius: '9999px',
                transition: 'background-color 0.2s'
              }}
              onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#F3F4F6'}
              onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
            >
              <X size={20} />
            </button>
          </div>

          <nav>
            <ul style={navListStyle}>
              {navLinks.map((link) => {
                // Check if current path matches this link
                const isActive = window.location.pathname === link.path;

                return (
                  <li key={link.path}>
                    <NavLink
                      to={link.path}
                      style={getLinkStyle(isActive)}
                      onClick={toggleMenu}
                      onMouseOver={(e) => {
                        if (!isActive) e.currentTarget.style.backgroundColor = '#F9FAFB';
                      }}
                      onMouseOut={(e) => {
                        if (!isActive) e.currentTarget.style.backgroundColor = 'transparent';
                      }}
                    >
                      <span style={{ color: '#4F46E5' }}>{link.icon}</span>
                      {link.text}
                    </NavLink>
                  </li>
                );
              })}
            </ul>
          </nav>
        </aside>
      )}
    </div>
  );
}