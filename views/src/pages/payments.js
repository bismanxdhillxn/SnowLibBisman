import { useEffect, useState } from "react";
// import Sidebar from "../components/Sidebar"; // or Sidebar if renamed
import axios from "axios";

export default function PaymentsPage() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/payments");
        setPayments(response.data);
      } catch (err) {
        console.error("Failed to fetch payments:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPayments();
  }, []);


  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="flex">
        {/* <Sidebar /> */}
        <main className="flex-1 p-6 mt-20 md:ml-64">
          <h1 className="text-2xl font-semibold mb-4">Payments</h1>
          {loading ? (
            <p>Loading payments...</p>
          ) : (
            <table className="min-w-full bg-white shadow rounded-lg">
              <thead>
                <tr className="bg-gray-200 text-left">
                  <th className="p-2">Payment ID</th>
                  <th className="p-2">Order ID</th>
                  <th className="p-2">Amount</th>
                  <th className="p-2">Method</th>
                  <th className="p-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {payments.map((payment) => (
                  <tr key={payment.id} className="border-t">
                    <td className="p-2">{payment.id}</td>
                    <td className="p-2">{payment.orderId}</td>
                    <td className="p-2">₹{payment.amount}</td>
                    <td className="p-2">{payment.method}</td>
                    <td className="p-2">{payment.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </main>
      </div>
    </div>
  );
}
