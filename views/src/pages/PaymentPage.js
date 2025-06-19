import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast, Bounce } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function PaymentsPage() {
  const [loading, setLoading] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [customerId, setCustomerId] = useState(null);
  const [cartItems, setCartItems] = useState([]);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("card");
  const [cardDetails, setCardDetails] = useState({
    cardNumber: "",
    cardName: "",
    expiry: "",
    cvv: ""
  });
  const [upiId, setUpiId] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    if (customerId) {
      fetchCartItems();
    }
  }, [customerId]);

  const checkAuth = async () => {
    try {
      const res = await axios.post(
        "http://localhost:5000/api/auth/check-auth",
        {},
        { withCredentials: true }
      );
      if (!res.data.user?.id) {
        navigate("/login");
        return;
      }
      setCustomerId(res.data.user.id);
    } catch (err) {
      navigate("/login");
    }
  };

  const fetchCartItems = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/cart", {
        withCredentials: true,
      });
      const filteredItems = res.data.filter(
        (item) => item.customer?.id === customerId
      );
      setCartItems(filteredItems);
    } catch (err) {
      console.error("Error fetching cart:", err);
    }
  };

  const calculateSubtotal = () => {
    return cartItems.reduce(
      (sum, item) => sum + item.book.price * item.quantity,
      0
    );
  };

  const handlePayment = async () => {
    if (!customerId) return;
    setLoading(true);

    try {
      const res = await axios.post(
        "http://localhost:5000/api/orders/",
        {
          customerId,
          status: selectedPaymentMethod === "cod" ? "Pending" : "Paid",
        },
        { withCredentials: true }
      );

      const createdOrder = res.data.order;

      await axios.post(
        "http://localhost:5000/api/payments",
        {
          orderId: createdOrder.id,
          amount: calculateSubtotal() + 50,
          method: getPaymentMethodText(),
          status: selectedPaymentMethod === "cod" ? "Pending" : "Success",
        },
        { withCredentials: true }
      );

      setPaymentSuccess(true);
      setTimeout(() => navigate("/order-confirmation"), 2000);
    } catch (err) {
      toast.error('Payment failed or order creation error', {
        position: "top-right",
        autoClose: 5000,
        theme: "dark",
        transition: Bounce,
      });
    } finally {
      setLoading(false);
    }
  };

  const getPaymentMethodText = () => {
    switch (selectedPaymentMethod) {
      case "card": return "Credit/Debit Card";
      case "upi": return "UPI";
      case "cod": return "Cash on Delivery";
      default: return "Online";
    }
  };

  const handleCardInputChange = (e) => {
    const { name, value } = e.target;
    setCardDetails((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const renderPaymentMethodForm = () => {
    if (selectedPaymentMethod === "card") {
      return (
        <div className="space-y-4">
          <input
            type="text"
            name="cardNumber"
            placeholder="Card Number"
            className="w-full px-3 py-2 bg-gray-800 text-white rounded-md"
            value={cardDetails.cardNumber}
            onChange={handleCardInputChange}
          />
          <input
            type="text"
            name="cardName"
            placeholder="Name on Card"
            className="w-full px-3 py-2 bg-gray-800 text-white rounded-md"
            value={cardDetails.cardName}
            onChange={handleCardInputChange}
          />
          <div className="flex gap-4">
            <input
              type="text"
              name="expiry"
              placeholder="MM/YY"
              className="w-full px-3 py-2 bg-gray-800 text-white rounded-md"
              value={cardDetails.expiry}
              onChange={handleCardInputChange}
            />
            <input
              type="text"
              name="cvv"
              placeholder="CVV"
              className="w-full px-3 py-2 bg-gray-800 text-white rounded-md"
              value={cardDetails.cvv}
              onChange={handleCardInputChange}
            />
          </div>
        </div>
      );
    } else if (selectedPaymentMethod === "upi") {
      return (
        <input
          type="text"
          placeholder="yourname@upi"
          className="w-full px-3 py-2 bg-gray-800 text-white rounded-md mt-2"
          value={upiId}
          onChange={(e) => setUpiId(e.target.value)}
        />
      );
    } else if (selectedPaymentMethod === "cod") {
      return (
        <p className="mt-2 text-gray-300">
          Cash on Delivery selected. $50 extra charges apply.
        </p>
      );
    } else {
      return null;
    }
  };

  return (
    <div className="min-h-screen bg-black text-white px-4 py-10">
      {paymentSuccess ? (
        <div className="max-w-md mx-auto text-center bg-gray-900 p-6 rounded-lg border border-gray-700">
          <h2 className="text-2xl font-bold text-green-400 mb-2">Payment Successful!</h2>
          <p className="text-gray-300 mb-4">
            {selectedPaymentMethod === "cod"
              ? "Order placed. Please pay on delivery."
              : "Payment processed successfully. Thank you!"}
          </p>
          <button
            onClick={() => navigate("/order-tracking")}
            className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-md"
          >
            Track Order
          </button>
        </div>
      ) : (
        <div className="max-w-md mx-auto bg-gray-900 p-6 rounded-lg border border-gray-800">
          <h1 className="text-2xl font-bold mb-6 text-teal-400 text-center">Checkout</h1>

          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-2">Your Items</h2>
            <ul className="text-sm text-gray-300 space-y-1 max-h-32 overflow-auto">
              {cartItems.map((item) => (
                <li key={item.id} className="flex justify-between">
                  <span>{item.book.title} × {item.quantity}</span>
                  <span>${(item.book.price * item.quantity).toFixed(2)}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="mb-6 border-t border-gray-700 pt-4">
            <div className="flex justify-between mb-1">
              <span>Subtotal:</span>
              <span>${calculateSubtotal().toFixed(2)}</span>
            </div>
            <div className="flex justify-between mb-1">
              <span>Shipping:</span>
              <span>$50.00</span>
            </div>
            <div className="flex justify-between font-bold text-teal-400">
              <span>Total:</span>
              <span>${(calculateSubtotal() + 50).toFixed(2)}</span>
            </div>
          </div>

          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-2">Payment Method</h2>
            <div className="grid grid-cols-3 gap-2 mb-4">
              {["card", "upi", "cod"].map((method) => (
                <button
                  key={method}
                  className={`py-2 px-4 border rounded-md text-sm ${
                    selectedPaymentMethod === method
                      ? "bg-teal-900 border-teal-600 text-teal-200"
                      : "bg-gray-800 border-gray-700 text-gray-300"
                  }`}
                  onClick={() => setSelectedPaymentMethod(method)}
                >
                  {method === "card" ? "Card" : method.toUpperCase()}
                </button>
              ))}
            </div>
            {renderPaymentMethodForm()}
          </div>

          <button
            onClick={handlePayment}
            disabled={loading}
            className="w-full py-2 px-4 bg-teal-600 hover:bg-teal-700 rounded-md"
          >
            {loading ? "Processing..." : "Pay Now"}
          </button>
        </div>
      )}
    </div>
  );
}
