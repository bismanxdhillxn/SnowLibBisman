import React from "react";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white">
      <div className="max-w-7xl mx-auto px-4 py-10 grid grid-cols-1 sm:grid-cols-3 gap-8">
        
        {/* Logo & Description */}
        <div>
          <h2 className="text-xl font-bold mb-2">BookBazaar</h2>
          <p className="text-sm text-gray-300">
            Your one-stop shop for books across genres. Discover, read, and enjoy!
          </p>
        </div>

        {/* Navigation */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Quick Links</h3>
          <ul className="space-y-2 text-sm">
            <li><Link to="/" className="hover:underline">Home</Link></li>
            <li><Link to="/products" className="hover:underline">Browse Books</Link></li>
            <li><Link to="/account" className="hover:underline">My Account</Link></li>
            <li><Link to="/cart" className="hover:underline">Cart</Link></li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Contact</h3>
          <p className="text-sm text-gray-300">Email: support@bookbazaar.com</p>
          <p className="text-sm text-gray-300">Phone: +1 123-456-7890</p>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="bg-gray-900 text-center text-sm py-4 text-gray-400">
        © {new Date().getFullYear()} BookBazaar. All rights reserved.
      </div>
    </footer>
  );
}
