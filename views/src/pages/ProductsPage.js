import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast, Bounce } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function ProductsPage() {
  const navigate = useNavigate();
  const [books, setBooks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [publishers, setPublishers] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState({});
  const [selectedPublishers, setSelectedPublishers] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [customerId, setCustomerId] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetchData();
    checkAuth();

    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      setShowFilters(window.innerWidth >= 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      await Promise.all([fetchBooks(), fetchCategories(), fetchPublishers()]);
    } catch (err) {
      setError("Failed to load data.");
    } finally {
      setLoading(false);
    }
  };

  const fetchBooks = async () => {
    const res = await fetch("http://localhost:5000/api/books/");
    const data = await res.json();
    setBooks(data);
  };

  const fetchCategories = async () => {
    const res = await fetch("http://localhost:5000/api/categories/");
    const data = await res.json();
    setCategories(data);
  };

  const fetchPublishers = async () => {
    const res = await fetch("http://localhost:5000/api/publishers/");
    const data = await res.json();
    setPublishers(data);
  };

  const checkAuth = async () => {
    try {
      const res = await axios.post(
        "http://localhost:5000/api/auth/check-auth",
        {},
        { withCredentials: true }
      );
      const sessionData = res.data;
      if (sessionData.user?.id) {
        setCustomerId(sessionData.user.id);
      }
    } catch (err) {
      console.error("Auth check failed", err);
      setCustomerId(null);
    }
  };

  const handleCategoryChange = (categoryId) => {
    setSelectedCategories((prev) => ({
      ...prev,
      [categoryId]: !prev[categoryId],
    }));
  };

  const handlePublisherChange = (publisherId) => {
    setSelectedPublishers((prev) => ({
      ...prev,
      [publisherId]: !prev[publisherId],
    }));
  };

  const filteredBooks = books.filter((book) => {
    const hasSelectedCategories = Object.values(selectedCategories).some(
      (value) => value
    );
    const hasSelectedPublishers = Object.values(selectedPublishers).some(
      (value) => value
    );

    const matchCategory =
      !hasSelectedCategories || selectedCategories[book.categoryId];
    const matchPublisher =
      !hasSelectedPublishers || selectedPublishers[book.publisherId];

    return matchCategory && matchPublisher;
  });

  const handleAddToCart = async (bookId) => {
    try {
      if (!customerId) {
        toast.warning('You must be logged in to add items to your cart.', {
                  position: "top-right",
                  autoClose: 5000,
                  hideProgressBar: false,
                  closeOnClick: false,
                  pauseOnHover: true,
                  draggable: true,
                  progress: undefined,
                  theme: "dark",
                  transition: Bounce,
                });
        navigate("/login");
        return;
      }

      const cartRes = await fetch("http://localhost:5000/api/cart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          customerId,
          bookId,
          quantity: 1,
        }),
      });

      const result = await cartRes.json();

      if (cartRes.ok) {
        toast.success('Book added to cart!', {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
          transition: Bounce,
        });
      } else {
        toast.error(result.error || 'Error adding book to cart.', {
          position: "top-right",
          autoClose: 5000,
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
      console.error("Add to cart error:", error);
      toast.error('Something went wrong. Try again later.', {
        position: "top-right",
        autoClose: 5000,
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

  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  const clearFilters = () => {
    setSelectedCategories({});
    setSelectedPublishers({});
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-xl font-semibold">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-xl font-semibold text-red-600">{error}</div>
      </div>
    );
  }

  return (
    <div className="relative w-full min-h-screen overflow-hidden bg-gradient-to-b from-red-100 to-blue-100">
      {/* Animated floating books background */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        {/* Book 1 - Slow floating top-left to bottom-right */}
        <div className="absolute text-8xl top-10 left-10 opacity-20 animate-float1">
          📚
        </div>
        
        {/* Book 2 - Medium floating right to left */}
        <div className="absolute text-7xl top-1/4 right-20 opacity-15 animate-float2">
          📕
        </div>
        
        {/* Book 3 - Fast floating bottom to top */}
        <div className="absolute text-6xl bottom-20 left-1/3 opacity-25 animate-float3">
          📘
        </div>
        
        {/* Book 4 - Slow rotation */}
        <div className="absolute text-7xl top-1/2 right-1/3 opacity-20 animate-float4">
          📖
        </div>
        
        {/* Book 5 - Bouncing book */}
        <div className="absolute text-5xl bottom-40 right-20 opacity-30 animate-float5">
          📙
        </div>
        
        {/* Book 6 - Large slow-moving book */}
        <div className="absolute text-9xl -bottom-20 -left-10 opacity-10 animate-float6">
          📔
        </div>
        
        {/* Book 7 - Small fast book */}
        <div className="absolute text-4xl top-40 left-1/2 opacity-25 animate-float7">
          📗
        </div>
      </div>

      {/* Foreground content */}
      <div className="relative z-10 pt-4 px-4 md:px-8">
        {/* Enhanced header with animation and styling */}
        <div className="container mx-auto py-8">
          <div className="mb-12 text-center relative">
            <div className="relative inline-block">
              <h1 className="text-4xl md:text-5xl font-bold mt-20 text-transparent bg-clip-text bg-gradient-to-r from-blue-800 via-indigo-600 to-purple-700 mb-2 animate-pulse-subtle">
                Book Catalog
              </h1>
            </div>
            <p className="text-gray-600 max-w-xl mx-auto italic">
              Discover your next adventure through the pages of our curated collection
            </p>
            
            {/* Decorative elements */}
            <span className="absolute -left-6 top-1/2 transform -translate-y-1/2 text-4xl opacity-60 rotate-12 hidden md:block">
              📚
            </span>
            <span className="absolute -right-6 top-1/2 transform -translate-y-1/2 text-4xl opacity-60 -rotate-12 hidden md:block">
              📚
            </span>
          </div>

          {/* Mobile filter toggle */}
          {isMobile && (
            <button
              onClick={toggleFilters}
              className="w-full mb-4 bg-blue-500 text-white py-2 rounded flex justify-center items-center transition-all hover:bg-blue-600 shadow-md"
            >
              {showFilters ? "Hide Filters" : "Show Filters"}
            </button>
          )}

          <div className="flex flex-col md:flex-row gap-6">
            {/* Filters */}
            {(showFilters || !isMobile) && (
              <div className="w-full md:w-1/4 bg-white p-4 rounded shadow-md animate-fadeIn">
                <h2 className="text-xl font-semibold mb-4 text-blue-800">Filters</h2>

                <div className="mb-6">
                  <h3 className="font-medium text-gray-700 mb-2">Categories</h3>
                  <div className="space-y-2">
                    {categories.map((category) => (
                      <div key={category.id} className="flex items-center">
                        <input
                          type="checkbox"
                          id={`category-${category.id}`}
                          checked={!!selectedCategories[category.id]}
                          onChange={() => handleCategoryChange(category.id)}
                          className="mr-2 h-4 w-4 accent-blue-600"
                        />
                        <label
                          htmlFor={`category-${category.id}`}
                          className="text-gray-700"
                        >
                          {category.name}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mb-6">
                  <h3 className="font-medium text-gray-700 mb-2">Publishers</h3>
                  <div className="space-y-2">
                    {publishers.map((publisher) => (
                      <div key={publisher.id} className="flex items-center">
                        <input
                          type="checkbox"
                          id={`publisher-${publisher.id}`}
                          checked={!!selectedPublishers[publisher.id]}
                          onChange={() => handlePublisherChange(publisher.id)}
                          className="mr-2 h-4 w-4 accent-blue-600"
                        />
                        <label
                          htmlFor={`publisher-${publisher.id}`}
                          className="text-gray-700"
                        >
                          {publisher.name}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  onClick={clearFilters}
                  className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 rounded transition-colors"
                >
                  Clear Filters
                </button>
              </div>
            )}

            {/* Product Cards */}
            <div className="w-full md:w-3/4">
              {filteredBooks.length === 0 ? (
                <div className="text-center py-10 bg-white/60 rounded shadow-sm">
                  <p className="text-lg text-gray-600">
                    No books found matching your filters.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredBooks.map((book, index) => (
                    <div
                      key={book.id}
                      className="border rounded-lg overflow-hidden shadow-md bg-white/60 hover:shadow-lg transition-all hover:-translate-y-1 duration-300"
                      style={{ 
                        animationDelay: `${index * 0.1}s`,
                        animation: 'fadeInUp 0.6s ease-out forwards',
                        opacity: 0,
                        transform: 'translateY(20px)'
                      }}
                    >
                      <div className="h-48 bg-gray-200 flex items-center justify-center relative overflow-hidden">
                        {book.image ? (
                          <img
                            src={book.image}
                            alt={book.title}
                            className="h-full w-full object-cover hover:scale-110 transition-transform duration-700"
                          />
                        ) : (
                          <div className="text-gray-500 text-5xl">📖</div>
                        )}
                      </div>

                      <div className="p-4">
                        <h3 className="text-lg font-semibold mb-2 line-clamp-2 text-blue-900">
                          {book.title}
                        </h3>
                        <p className="text-sm text-gray-500">
                          Category:{" "}
                          <span className="text-indigo-600">
                            {categories.find((c) => c.id === book.categoryId)
                              ?.name || "N/A"}
                          </span>
                          <br />
                          Publisher:{" "}
                          <span className="text-indigo-600">
                            {publishers.find((p) => p.id === book.publisherId)
                              ?.name || "N/A"}
                          </span>
                        </p>
                        <p className="text-green-600 font-bold mb-4 text-xl">
                          ${book.price.toFixed(2)}
                        </p>
                        {customerId ? (
                          <button
                            onClick={() => handleAddToCart(book.id)}
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md transition-colors duration-300 flex items-center justify-center gap-2"
                          >
                            <span>Add to Cart</span>
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path>
                            </svg>
                          </button>
                        ) : (
                          <button
                            onClick={() => navigate("/login")}
                            className="w-full bg-gray-300 hover:bg-gray-400 text-gray-700 py-2 rounded-md transition-colors duration-300 flex items-center justify-center gap-2"
                          >
                            <span>Login to Purchase</span>
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"></path>
                            </svg>
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* CSS Animations */}
      <style jsx>{`
        @keyframes float1 {
          0% { transform: translate(0, 0) rotate(0deg); }
          50% { transform: translate(20px, 20px) rotate(5deg); }
          100% { transform: translate(0, 0) rotate(0deg); }
        }
        
        @keyframes float2 {
          0% { transform: translate(0, 0) rotate(0deg); }
          50% { transform: translate(-15px, 15px) rotate(-3deg); }
          100% { transform: translate(0, 0) rotate(0deg); }
        }
        
        @keyframes float3 {
          0% { transform: translate(0, 0) rotate(0deg); }
          33% { transform: translate(0, -20px) rotate(5deg); }
          66% { transform: translate(10px, -30px) rotate(10deg); }
          100% { transform: translate(0, 0) rotate(0deg); }
        }
        
        @keyframes float4 {
          0% { transform: rotate(0deg); }
          50% { transform: rotate(10deg); }
          100% { transform: rotate(0deg); }
        }
        
        @keyframes float5 {
          0% { transform: translateY(0); }
          50% { transform: translateY(-20px); }
          75% { transform: translateY(-15px); }
          100% { transform: translateY(0); }
        }
        
        @keyframes float6 {
          0% { transform: translate(0, 0) rotate(0deg); }
          33% { transform: translate(40px, -20px) rotate(-5deg); }
          66% { transform: translate(20px, 10px) rotate(3deg); }
          100% { transform: translate(0, 0) rotate(0deg); }
        }
        
        @keyframes float7 {
          0% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(-20px, 20px) scale(1.1); }
          100% { transform: translate(0, 0) scale(1); }
        }
        
        @keyframes pulse-subtle {
          0% { opacity: 0.95; }
          50% { opacity: 1; }
          100% { opacity: 0.95; }
        }
        
        @keyframes expand {
          0% { width: 0; opacity: 0; }
          100% { width: 100%; opacity: 1; }
        }
        
        @keyframes fadeInUp {
          0% { opacity: 0; transform: translateY(20px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes fadeIn {
          0% { opacity: 0; }
          100% { opacity: 1; }
        }
        
        .animate-float1 {
          animation: float1 8s ease-in-out infinite;
        }
        
        .animate-float2 {
          animation: float2 10s ease-in-out infinite;
        }
        
        .animate-float3 {
          animation: float3 12s ease-in-out infinite;
        }
        
        .animate-float4 {
          animation: float4 15s ease-in-out infinite;
        }
        
        .animate-float5 {
          animation: float5 6s ease-in-out infinite;
        }
        
        .animate-float6 {
          animation: float6 20s ease-in-out infinite;
        }
        
        .animate-float7 {
          animation: float7 9s ease-in-out infinite;
        }
        
        .animate-pulse-subtle {
          animation: pulse-subtle 3s ease-in-out infinite;
        }
        
        .animate-expand {
          animation: expand 1.5s ease-out forwards;
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.8s ease-out forwards;
        }
      `}</style>
    </div>
  );
}