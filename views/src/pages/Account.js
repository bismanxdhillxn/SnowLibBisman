import React, { useEffect, useState } from "react";
import { toast, Bounce } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Footer from "../components/Footer";
import AOS from "aos";
import "aos/dist/aos.css";

export default function AccountPage() {
  const [user, setUser] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState([]);
  const [payments, setPayments] = useState([]);
  const [activeTab, setActiveTab] = useState("profile");

  useEffect(() => {
    // Initialize AOS animations
    AOS.init({
      duration: 1000,
      once: false,
      mirror: true,
    });
    AOS.refresh();

    const fetchData = async () => {
      setLoading(true);
      try {
        const sessionRes = await fetch("http://localhost:5000/api/auth/check-auth", {
          method: "POST",
          credentials: "include",
        });

        if (!sessionRes.ok) {
          // For development purposes, load dummy data instead of redirecting
          loadDummyData();
          return;
        }

        const sessionData = await sessionRes.json();
        const userId = sessionData.user?.id;

        const userRes = await fetch(`http://localhost:5000/api/auth/${userId}`, {
          credentials: "include",
        });

        if (userRes.ok) {
          const userData = await userRes.json();
          setUser(userData);
          setForm({
            name: userData.name || "",
            email: userData.email || "",
            password: ""
          });

          const ordersRes = await fetch("http://localhost:5000/api/orders");
          const paymentsRes = await fetch("http://localhost:5000/api/payments");

          const ordersData = await ordersRes.json();
          const paymentsData = await paymentsRes.json();

          setOrders(ordersData.filter(order => order.customer?.userId === userId));
          setPayments(paymentsData.filter(payment => payment.customer?.userId === userId));
        }
      } catch (error) {
        console.error("Fetch error:", error);
        // Load dummy data on error for development purposes
        loadDummyData();
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Load dummy data for development and testing
  const loadDummyData = () => {
    const dummyUser = {
      id: "user123",
      name: "Rahul Sharma",
      email: "rahul.sharma@example.com",
      role: { name: "Customer" },
      createdAt: "2024-01-15T10:30:00.000Z"
    };

    const dummyOrders = [
      {
        id: "ORD-2024-001",
        createdAt: "2024-03-28T14:22:00.000Z",
        totalAmount: 1249,
        status: "Delivered",
        customer: { userId: "user123" }
      },
      {
        id: "ORD-2024-002",
        createdAt: "2024-04-05T09:15:00.000Z",
        totalAmount: 899,
        status: "Processing",
        customer: { userId: "user123" }
      },
      {
        id: "ORD-2024-003",
        createdAt: "2024-04-10T16:45:00.000Z",
        totalAmount: 1599,
        status: "Shipped",
        customer: { userId: "user123" }
      }
    ];

    const dummyPayments = [
      {
        id: "PAY-2024-001",
        createdAt: "2024-03-28T14:25:00.000Z",
        amount: 1249,
        method: "Credit Card",
        customer: { userId: "user123" }
      },
      {
        id: "PAY-2024-002",
        createdAt: "2024-04-05T09:18:00.000Z",
        amount: 899,
        method: "UPI",
        customer: { userId: "user123" }
      },
      {
        id: "PAY-2024-003",
        createdAt: "2024-04-10T16:48:00.000Z",
        amount: 1599,
        method: "PayPal",
        customer: { userId: "user123" }
      }
    ];

    setUser(dummyUser);
    setOrders(dummyOrders);
    setPayments(dummyPayments);
    setForm({
      name: dummyUser.name || "",
      email: dummyUser.email || "",
      password: ""
    });
  };

  const handleUpdate = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/auth/${user.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          password: form.password || undefined
        }),
      });

      const data = await res.json();
      if (res.ok) {
        toast.success('Profile updated successfully', {
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
        setEditMode(false);
        setUser({ ...user, ...data });
      } else {
        toast.error(data.error || 'Update failed', {
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
    } catch (err) {
      toast.error('Error updating profile', {
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

  const handleLogout = async () => {
    try {
      await fetch("http://localhost:5000/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });
      localStorage.clear();
      toast.success('Logged out successfully', {
        position: "top-right",
        theme: "dark",
        transition: Bounce,
      });
      window.location.href = "/login";
    } catch (err) {
      console.error("Logout error:", err);
      toast.error('Logout failed', {
        position: "top-right",
        theme: "dark",
        transition: Bounce,
      });
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#2c3e50] to-[#1a242f] text-white">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-t-yellow-400 border-b-yellow-400 border-l-gray-300 border-r-gray-300 rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-xl">Loading your profile...</p>
      </div>
    </div>
  );

  return (
    <div 
      style={{ 
        backgroundImage: "linear-gradient(to bottom, rgba(44, 62, 80, 0.1), rgba(44, 62, 80, 0.05))",
        backgroundColor: "#f8f9fa" 
      }} 
      className="bg-fixed bg-center bg-cover dark:from-gray-900 dark:to-gray-800 text-gray-800 dark:text-gray-100 min-h-screen font-sans transition-all duration-700"
    >
      {/* Header Banner */}
      <section className="relative h-[250px] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#2c3e50]/90 to-[#1a242f]/80" />
        <div 
          className="absolute inset-0"
          style={{ 
            backgroundImage: "url('/account-header-bg.jpg')", 
            backgroundSize: "cover", 
            backgroundPosition: "center",
            opacity: 0.2 
          }}
        />

        <div
          className="relative z-10 h-full flex flex-col items-center justify-center text-white text-center px-4 mt-10"
          data-aos="fade-up"
        >
          <h1 className="text-4xl sm:text-5xl font-bold mb-4 tracking-wide drop-shadow-xl">
            Your Account
          </h1>
          <p className="text-md sm:text-lg mb-6 opacity-90">
            Manage your profile, orders, and payments in one place
          </p>
        </div>
      </section>

      {/* Navigation Tabs */}
      <div className="bg-[#2c3e50] text-white py-4 px-4 shadow-md">
        <div className="max-w-6xl mx-auto flex overflow-x-auto no-scrollbar">
          {["profile", "orders", "payments"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-2 mx-2 text-lg font-medium rounded-md transition-all duration-300 ${
                activeTab === tab
                  ? "bg-yellow-400 text-[#2c3e50]"
                  : "hover:bg-white/10"
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-6xl mx-auto px-4 py-10">
        {/* Profile Section */}
        {activeTab === "profile" && (
          <div 
            className="bg-white/90 dark:bg-gray-800/90 rounded-xl shadow-xl overflow-hidden"
            data-aos="fade-up"
          >
            <div className="bg-gradient-to-r from-[#2c3e50] to-[#1a242f] text-white p-6">
              <h2 className="text-2xl font-bold">Profile Settings</h2>
            </div>

            <div className="p-8">
              {editMode ? (
                <div className="space-y-6">
                  {["name", "email", "password"].map((field) => (
                    <div key={field} className="transition-all duration-300 hover:translate-x-2">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 capitalize mb-2">
                        {field}
                      </label>
                      <input
                        type={field === "password" ? "password" : "text"}
                        name={field}
                        value={form[field]}
                        onChange={handleChange}
                        placeholder={
                          field === "password" ? "Leave blank to keep current" : `Enter your ${field}`
                        }
                        className="block w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:ring-2 focus:ring-yellow-400 focus:border-transparent bg-white/80 dark:bg-gray-700/80 text-gray-800 dark:text-white"
                      />
                    </div>
                  ))}

                  <div className="flex gap-4 mt-8">
                    <button
                      onClick={handleUpdate}
                      className="bg-[#2c3e50] hover:bg-[#1a242f] text-white font-semibold px-6 py-3 rounded-md shadow-md transition-all duration-300 transform hover:-translate-y-1 hover:scale-105"
                    >
                      Save Changes
                    </button>
                    <button
                      onClick={() => setEditMode(false)}
                      className="bg-gray-500 hover:bg-gray-600 text-white font-semibold px-6 py-3 rounded-md shadow-md transition-all duration-300 transform hover:-translate-y-1 hover:scale-105"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-6 text-gray-700 dark:text-gray-300">
                  <div className="flex items-center gap-6">
                    <div className="w-24 h-24 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center text-white text-3xl font-bold">
                      {user?.name?.charAt(0).toUpperCase() || "U"}
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-gray-800 dark:text-white">{user?.name}</h3>
                      <span className="inline-block mt-2 px-3 py-1 bg-yellow-400 text-[#2c3e50] text-sm font-medium rounded-full">
                        {user?.role?.name || "Customer"}
                      </span>
                    </div>
                  </div>

                  <div className="mt-8 divide-y dark:divide-gray-700">
                    <div className="py-4 flex flex-wrap justify-between">
                      <span className="font-semibold text-gray-900 dark:text-gray-200">Email</span>
                      <span>{user?.email}</span>
                    </div>
                    <div className="py-4 flex flex-wrap justify-between">
                      <span className="font-semibold text-gray-900 dark:text-gray-200">Member Since</span>
                      <span>{new Date(user?.createdAt || Date.now()).toLocaleDateString()}</span>
                    </div>
                    <div className="py-4 flex flex-wrap justify-between">
                      <span className="font-semibold text-gray-900 dark:text-gray-200">Reading Preferences</span>
                      <span>Fiction, Mystery, Biography</span>
                    </div>
                    <div className="py-4 flex flex-wrap justify-between">
                      <span className="font-semibold text-gray-900 dark:text-gray-200">Favorite Author</span>
                      <span>Amish Tripathi</span>
                    </div>
                  </div>

                  <div className="flex gap-4 mt-8">
                    <button
                      onClick={() => setEditMode(true)}
                      className="bg-yellow-400 hover:bg-yellow-500 text-[#2c3e50] font-semibold px-6 py-3 rounded-md shadow-md transition-all duration-300 transform hover:-translate-y-1 hover:scale-105"
                    >
                      Edit Profile
                    </button>
                    <button
                      onClick={handleLogout}
                      className="bg-[#2c3e50] hover:bg-[#1a242f] text-white font-semibold px-6 py-3 rounded-md shadow-md transition-all duration-300 transform hover:-translate-y-1 hover:scale-105"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Orders Section */}
        {activeTab === "orders" && (
          <div 
            className="bg-white/90 dark:bg-gray-800/90 rounded-xl shadow-xl overflow-hidden"
            data-aos="fade-up"
          >
            <div className="bg-gradient-to-r from-[#2c3e50] to-[#1a242f] text-white p-6">
              <h2 className="text-2xl font-bold">Order History</h2>
            </div>

            <div className="p-6">
              {orders.length ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead className="bg-gray-100 dark:bg-gray-700">
                      <tr>
                        <th className="px-6 py-4 text-gray-700 dark:text-gray-300">Order ID</th>
                        <th className="px-6 py-4 text-gray-700 dark:text-gray-300">Date</th>
                        <th className="px-6 py-4 text-gray-700 dark:text-gray-300">Amount</th>
                        <th className="px-6 py-4 text-gray-700 dark:text-gray-300">Status</th>
                        <th className="px-6 py-4 text-gray-700 dark:text-gray-300">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.map((order, idx) => (
                        <tr 
                          key={order.id} 
                          className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                          data-aos="fade-up"
                          data-aos-delay={idx * 50}
                        >
                          <td className="px-6 py-4 font-medium">{order.id}</td>
                          <td className="px-6 py-4">{new Date(order.createdAt || Date.now()).toLocaleDateString()}</td>
                          <td className="px-6 py-4">₹{order.totalAmount}</td>
                          <td className="px-6 py-4">
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                              order.status === "Delivered" ? "bg-green-100 text-green-800" :
                              order.status === "Processing" ? "bg-blue-100 text-blue-800" :
                              order.status === "Shipped" ? "bg-yellow-100 text-yellow-800" :
                              "bg-gray-100 text-gray-800"
                            }`}>
                              {order.status}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <button className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-medium">
                              View Details
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-10">
                  <div className="w-16 h-16 mx-auto mb-4 text-gray-400">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300">No orders yet</h3>
                  <p className="mt-2 text-gray-500 dark:text-gray-400">Your order history will appear here once you make a purchase.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Payments Section */}
        {activeTab === "payments" && (
          <div 
            className="bg-white/90 dark:bg-gray-800/90 rounded-xl shadow-xl overflow-hidden"
            data-aos="fade-up"
          >
            <div className="bg-gradient-to-r from-[#2c3e50] to-[#1a242f] text-white p-6">
              <h2 className="text-2xl font-bold">Payment History</h2>
            </div>

            <div className="p-6">
              {payments.length ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead className="bg-gray-100 dark:bg-gray-700">
                      <tr>
                        <th className="px-6 py-4 text-gray-700 dark:text-gray-300">Payment ID</th>
                        <th className="px-6 py-4 text-gray-700 dark:text-gray-300">Date</th>
                        <th className="px-6 py-4 text-gray-700 dark:text-gray-300">Amount</th>
                        <th className="px-6 py-4 text-gray-700 dark:text-gray-300">Method</th>
                        <th className="px-6 py-4 text-gray-700 dark:text-gray-300">Invoice</th>
                      </tr>
                    </thead>
                    <tbody>
                      {payments.map((payment, idx) => (
                        <tr 
                          key={payment.id} 
                          className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                          data-aos="fade-up"
                          data-aos-delay={idx * 50}
                        >
                          <td className="px-6 py-4 font-medium">{payment.id}</td>
                          <td className="px-6 py-4">{new Date(payment.createdAt || Date.now()).toLocaleDateString()}</td>
                          <td className="px-6 py-4">₹{payment.amount}</td>
                          <td className="px-6 py-4">
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                              payment.method === "Credit Card" ? "bg-blue-100 text-blue-800" :
                              payment.method === "PayPal" ? "bg-indigo-100 text-indigo-800" :
                              payment.method === "UPI" ? "bg-purple-100 text-purple-800" :
                              "bg-gray-100 text-gray-800"
                            }`}>
                              {payment.method}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <button className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-medium">
                              Download
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-10">
                  <div className="w-16 h-16 mx-auto mb-4 text-gray-400">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300">No payments yet</h3>
                  <p className="mt-2 text-gray-500 dark:text-gray-400">Your payment history will appear here once you make a purchase.</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Recently Viewed Books Section */}
      <section className="py-16 bg-gray-100/80 dark:bg-gray-900/50">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-2xl font-semibold mb-8" data-aos="fade-up">Recently Viewed Books</h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { id: 1, title: "The Immortals of Meluha", author: "Amish Tripathi", image: "https://m.media-amazon.com/images/I/81Fpe3oU9DL._AC_UF1000,1000_QL80_.jpg" },
              { id: 2, title: "The Psychology of Money", author: "Morgan Housel", image: "https://m.media-amazon.com/images/I/71TRUbzcvaL._AC_UF1000,1000_QL80_.jpg" },
              { id: 3, title: "Sapiens", author: "Yuval Noah Harari", image: "https://m.media-amazon.com/images/I/713jIoMO3UL._AC_UF1000,1000_QL80_.jpg" },
              { id: 4, title: "Atomic Habits", author: "James Clear", image: "https://m.media-amazon.com/images/I/81YkqyaFVEL._AC_UF1000,1000_QL80_.jpg" }
            ].map((book, idx) => (
              <div 
                key={book.id}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 transform hover:scale-105"
                data-aos="fade-up"
                data-aos-delay={idx * 100}
              >
                <img 
                  src={book.image} 
                  alt={book.title} 
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <h3 className="font-medium text-gray-800 dark:text-gray-200 mb-1 truncate">{book.title}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">by {book.author}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}