import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast, Bounce } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function CartPage() {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [customerId, setCustomerId] = useState(null);
  const [animationComplete, setAnimationComplete] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    checkAuth();
    
    // Trigger background animation after component mounts
    setTimeout(() => {
      setAnimationComplete(true);
    }, 100);
  }, []);
  
  useEffect(() => {
    if (customerId) {
      fetchCart(); 
    }
  }, [customerId]);
  
  const checkAuth = async () => {
    try {
      const res = await axios.post(
        "http://localhost:5000/api/auth/check-auth",
        {},
        { withCredentials: true }
      );

      const sessionData = res.data;
      if (!sessionData.user?.id) {
        navigate("/login");
        return;
      }
      setCustomerId(sessionData.user.id);
    } catch (err) {
      console.error("Auth check failed", err);
      navigate("/login");
    }
  };

  const fetchCart = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/cart", {
        withCredentials: true,
      });
  
      const allItems = res.data;
      const filteredItems = allItems.filter(item => item.customer?.id === customerId);
      setCartItems(filteredItems);
    } catch (err) {
      console.error(err);
      setError("Failed to load cart.");
    } finally {
      setLoading(false);
    }
  };
  
  const handleQuantityChange = async (cartItemId, quantity) => {
    if (quantity <= 0 || !customerId) return;

    try {
      const id = cartItemId;
      await axios.put(
        "http://localhost:5000/api/cart/",
        { customerId, id, quantity },
        { withCredentials: true }
      );
      fetchCart();
    } catch (err) {
      toast.error('Failed to update quantity', {
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

  const handleRemoveItem = async (bookId) => {
    try {
      const id = bookId;
      await axios.delete(`http://localhost:5000/api/cart/${bookId}`, {
        withCredentials: true,
        headers: { "Content-Type": "application/json" },
      });
      fetchCart();
    } catch (err) {
      toast.error('Failed to remove item', {
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

  const getTotal = () => {
    return cartItems
      .reduce((sum, item) => sum + item.book.price * item.quantity, 0)
      .toFixed(2);
  };

  // Cart summary component
  const CartSummary = () => (
    <div className="bg-white/90 backdrop-blur-md rounded-lg shadow-lg p-6 border border-white/20 sticky top-6">
      <h2 className="text-xl font-semibold mb-4 pb-2 border-b border-gray-200">Order Summary</h2>
      <div className="flex justify-between mb-4">
        <span className="text-gray-700">Items ({cartItems.length}):</span>
        <span className="text-gray-700">${getTotal()}</span>
      </div>
      <div className="flex justify-between mb-4">
        <span className="text-gray-700">Shipping:</span>
        <span className="text-gray-700">$50</span>
      </div>
      <div className="border-t border-gray-200 pt-4 mb-4">
        <div className="flex justify-between">
          <span className="text-lg font-semibold text-gray-900">Total:</span>
          <span className="text-lg font-semibold text-gray-900">${getTotal()}</span>
        </div>
      </div>
      <div className="flex flex-col gap-3">
        <button
          onClick={() => navigate("/payment")}
          className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-full hover:from-indigo-700 hover:to-purple-700 transition-colors shadow-md hover:shadow-lg w-full"
        >
          Proceed to Checkout
        </button>
        <button
          onClick={() => navigate("/prods")}
          className="px-6 py-3 bg-gray-100 text-gray-800 rounded-full hover:bg-gray-200 transition-colors w-full"
        >
          Continue Shopping
        </button>
      </div>
    </div>
  );

  return (
    <div className="relative w-screen min-h-screen overflow-hidden">
      {/* Animated background with gradient blobs */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        {/* First background element */}
        <div 
          className={`absolute transition-all duration-1000 ease-in-out ${
            animationComplete ? "opacity-100" : "opacity-0 translate-x-full"
          }`}
          style={{
            top: "-10%",
            left: "-5%",
            width: "50%",
            height: "70%",
            borderRadius: "40% 60% 70% 30% / 40% 50% 60% 50%",
            background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
            filter: "blur(30px)",
            transform: animationComplete ? "rotate(-5deg)" : "rotate(45deg) translateX(100px)",
            zIndex: 0,
          }}
        />
        
        {/* Second background element */}
        <div 
          className={`absolute transition-all duration-1500 ease-in-out delay-200 ${
            animationComplete ? "opacity-70" : "opacity-0 -translate-y-full"
          }`}
          style={{
            top: "30%",
            right: "15%",
            width: "40%",
            height: "60%",
            borderRadius: "60% 40% 30% 70% / 60% 30% 70% 40%",
            background: "linear-gradient(135deg, #10b981 0%, #3b82f6 100%)",
            filter: "blur(40px)",
            transform: animationComplete ? "rotate(15deg)" : "rotate(-45deg) translateY(-100px)",
            zIndex: 0,
          }}
        />
        
        {/* Third background element */}
        <div 
          className={`absolute transition-all duration-2000 ease-in-out delay-400 ${
            animationComplete ? "opacity-80" : "opacity-0 translate-y-full"
          }`}
          style={{
            bottom: "-10%",
            left: "25%",
            width: "50%",
            height: "40%",
            borderRadius: "30% 70% 70% 30% / 30% 30% 70% 70%",
            background: "linear-gradient(135deg, #f59e0b 0%, #ef4444 100%)",
            filter: "blur(35px)",
            transform: animationComplete ? "rotate(-15deg)" : "rotate(45deg) translateY(100px)",
            zIndex: 0,
          }}
        />
      </div>

      {/* Main content overlay */}
      <div className="absolute inset-0 z-0 bg-white/30 backdrop-blur-sm"></div>

      {/* Foreground content */}
      <div className="relative z-10 pt-10 px-4 md:px-8">
        <div className="container mx-auto py-8">
          <h1 className="text-3xl font-bold mb-6 mt-6 text-center text-gray-800">
            Your Shopping Cart
          </h1>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="text-xl font-semibold">Loading your cart...</div>
            </div>
          ) : error ? (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
              <strong className="font-bold">Error!</strong>
              <span className="block sm:inline"> {error}</span>
            </div>
          ) : cartItems.length === 0 ? (
            <div className="bg-white/80 rounded-lg shadow-md p-8 text-center">
              <h2 className="text-2xl font-medium text-gray-700 mb-4">Your cart is empty</h2>
              <p className="text-gray-500 mb-6">Looks like you haven't added any books to your cart yet.</p>
              <button
                onClick={() => navigate("/prods")}
                className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              >
                Browse Books
              </button>
            </div>
          ) : (
            <div className="flex flex-col lg:flex-row gap-6">
              {/* Cart Items - 70% width on desktop, full width on mobile */}
              <div className="w-full lg:w-[70%] space-y-4">
                {cartItems.map((item) => (
                  <div
                    key={item.id}
                    className="bg-white/60 rounded-lg shadow-lg overflow-hidden flex flex-col sm:flex-row transform transition hover:shadow-xl hover:-translate-y-1"
                  >
                    {/* Book Image */}
                    <div className="w-full sm:w-1/4 h-48 bg-gray-100 flex items-center justify-center relative overflow-hidden">
                      {item.book.image ? (
                        <img
                          src={item.book.image}
                          alt={item.book.title}
                          className="h-full w-full object-cover transition-transform duration-500 hover:scale-110"
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full w-full bg-gradient-to-br from-indigo-100 to-purple-100">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-indigo-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                          </svg>
                        </div>
                      )}
                    </div>
                    
                    {/* Book Details */}
                    <div className="p-6 flex-1 flex flex-col justify-between">
                      <div>
                        <h2 className="text-xl font-semibold text-gray-800 mb-2">{item.book.title}</h2>
                        <p className="text-gray-600 mb-4">
                          {item.book.author ? `By ${item.book.author}` : ''}
                        </p>
                      </div>
                      
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
                        <div>
                          <p className="text-emerald-600 font-bold mb-1">
                            ${item.book.price.toFixed(2)} each
                          </p>
                          
                          <div className="flex items-center mt-2">
                            <span className="text-gray-600 mr-3">Quantity:</span>
                            <div className="flex border border-gray-300 rounded-full">
                              <button
                                onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                                className="px-3 py-1 text-gray-700 hover:bg-gray-100 rounded-l-full"
                                disabled={item.quantity <= 1}
                              >
                                −
                              </button>
                              <span className="px-4 py-1 flex items-center justify-center min-w-[40px]">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                                className="px-3 py-1 text-gray-700 hover:bg-gray-100 rounded-r-full"
                              >
                                +
                              </button>
                            </div>
                          </div>
                          
                          <p className="text-gray-700 font-medium mt-2">
                            Subtotal: ${(item.book.price * item.quantity).toFixed(2)}
                          </p>
                        </div>
                        
                        <button
                          onClick={() => handleRemoveItem(item.id)}
                          className="group text-gray-500 hover:text-red-500 flex items-center transition-colors"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1 transition-colors group-hover:text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Summary - 30% width on desktop, full width on mobile and displays at bottom */}
              <div className="w-full lg:w-[30%] mt-6 lg:mt-0">
                <CartSummary />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}