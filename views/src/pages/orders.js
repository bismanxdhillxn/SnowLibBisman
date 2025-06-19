import { useEffect, useState } from "react";
// import Navbar from "../components/Navbar";
// import Sidebar from "../components/Sidebar";
import axios from "axios";

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrdersAndUsers = async () => {
    try {
      const [ordersRes, usersRes] = await Promise.all([
        axios.get("http://localhost:5000/api/orders"),
        axios.get("http://localhost:5000/api/auth"),
      ]);
      setOrders(ordersRes.data);
      setUsers(usersRes.data);
    } catch (err) {
      console.error("Failed to fetch orders or users:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrdersAndUsers();
  }, []);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await axios.put(`http://localhost:5000/api/orders/${orderId}`, {
        status: newStatus,
      });
      fetchOrdersAndUsers(); // Refresh after update
    } catch (err) {
      console.error("Failed to update order status:", err);
    }
  };

  const handleDelete = async (orderId) => {
    if (!window.confirm("Are you sure you want to delete this order?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/orders/${orderId}`);
      setOrders(orders.filter((order) => order.id !== orderId));
    } catch (err) {
      console.error("Failed to delete order:", err);
    }
  };

  // Get user's name based on customer.userId
  const getCustomerName = (order) => {
    const userId = order.customer?.userId;
    if (!userId) return "N/A";
    const user = users.find((u) => u.id === userId);
    return user?.name || "Unknown";
  };

  return (
    <div className="flex">
      {/* <Sidebar /> */}
      <main className="flex-1 mt-20 p-6">
        <h1 className="text-2xl font-semibold mb-4">Orders</h1>
        {loading ? (
          <p>Loading orders...</p>
        ) : (
          <table className="min-w-full bg-white shadow rounded-lg">
            <thead>
              <tr className="bg-gray-200 text-left">
                <th className="p-2">Order ID</th>
                <th className="p-2">Customer</th>
                <th className="p-2">Total Amount</th>
                <th className="p-2">Status</th>
                <th className="p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id} className="border-t">
                  <td className="p-2">{order.id}</td>
                  <td className="p-2">{getCustomerName(order)}</td>
                  <td className="p-2">₹{order.totalAmount}</td>
                  <td className="p-2">
                    <select
                      value={order.status}
                      onChange={(e) => handleStatusChange(order.id, e.target.value)}
                      className="bg-gray-100 p-1 rounded"
                    >
                      <option value="Pending">Pending</option>
                      <option value="Paid">Paid</option>
                      <option value="Delivered">Delivered</option>
                    </select>
                  </td>
                  <td className="p-2">
                    <button
                      onClick={() => handleDelete(order.id)}
                      className="text-red-600 hover:underline"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </main>
    </div>
  );
}
