import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast, Bounce } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Link } from "react-router-dom";

function Home() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [animationComplete, setAnimationComplete] = useState(false);

  useEffect(() => {
    // Set animation complete status after delay
    const timer = setTimeout(() => {
      setAnimationComplete(true);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      console.log("Response:", data);

      if (data.user && Object.keys(data.user).length > 0) {
        toast.success('Login successful!', {
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
        window.location.href = "/account";
      } else {
        toast.error(data.error || 'An error occurred during login.', {
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
      toast.error('Network error. Please try again.', {
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
    } finally {
      setIsLoading(false);
    }
  };

  // SnowLib Logo Component
  const SnowLibLogo = ({ size = "default" }) => {
    // Size classes
    const sizeClasses = {
      small: "w-6 h-6",
      default: "w-8 h-8",
      large: "w-16 h-16",
      xl: "w-24 h-24"
    };
    
    const logoSize = sizeClasses[size] || sizeClasses.default;
    
    return (
      <div style={{transform: 'rotate(45deg)'}} className={`relative ${logoSize} border-2 border-white`}>
        <svg 
          width="100%" 
          height="100%" 
          viewBox="0 0 24 24" 
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
          fill="none" 
          stroke="white" 
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
  };

  return (
    <div className="min-h-screen w-full bg-gray-900 relative overflow-hidden">
      {/* Background with blur effect using CSS */}
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-20"
        style={{ 
          backgroundImage: "url('/girlbook.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          transform: "scaleX(-1)"
        }}
      ></div>
      
      {/* Gradient overlay */}
      <div className="absolute inset-0 "></div>
      
      {/* Floating snowflake animations */}
      <div className={`absolute inset-0 pointer-events-none ${animationComplete ? 'opacity-100' : 'opacity-0'} transition-opacity duration-1000`}>
        <div className="absolute top-1/4 left-1/6 animate-float-slow">
          <SnowLibLogo size="small" />
        </div>
        <div className="absolute top-2/3 left-1/4 animate-float-medium">
          <SnowLibLogo size="small" />
        </div>
        <div className="absolute top-1/3 right-1/4 animate-float-fast">
          <SnowLibLogo size="small" />
        </div>
      </div>
      
      {/* Main content container */}
      <div className="container mx-auto px-4 py-10 min-h-screen flex flex-col md:flex-row items-center justify-center relative z-10">
        {/* Left content - Branding section */}
        <div className="w-full md:w-1/2 mb-8 md:mb-0 text-center md:text-left md:pr-8 lg:pr-16 transform transition-all duration-700 translate-y-0 opacity-100">
          <div className={`transition-all duration-1000 delay-300 ${animationComplete ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            <div className="flex flex-col items-center md:items-start mb-6">
              <div className="flex items-center mb-4">
                <SnowLibLogo size="large" />
                <div className="text-4xl md:text-5xl lg:text-6xl font-bold ml-4" style={{
                  background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent'
                }}>
                  SnowLib
                </div>
              </div>
            </div>
            <p className="text-lg md:text-xl text-blue-100 mb-8 max-w-lg mx-auto md:mx-0">
              Your winter wonderland of knowledge. Discover rare titles and bestsellers in our pristine collection.
            </p>
            <div className="hidden md:block">
              <div className="flex flex-col md:flex-row space-y-3 md:space-y-0 md:space-x-4 mb-8">
                <div className="flex items-center text-blue-200">
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>Curated Selection</span>
                </div>
                <div className="flex items-center text-blue-200">
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>Literary Excellence</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Right content - Login form */}
        <div className="w-full md:w-1/2 max-w-md mx-auto">
          <div className={`bg-white rounded-lg shadow-2xl p-8 transform transition-all duration-700 ${animationComplete ? 'translate-x-0 opacity-100' : 'translate-x-10 opacity-0'}`}>
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Welcome Back</h2>
              <p className="text-gray-600 text-sm">Sign in to access your account</p>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2">Email Address</label>
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-gray-700 text-sm font-medium">Password</label>
                  <Link to="/forgot-password" className="text-xs text-blue-600 hover:text-blue-800">
                    Forgot Password?
                  </Link>
                </div>
                <input
                  type="password"
                  placeholder="Enter your password"
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <div className="flex items-center">
                <input 
                  id="remember-me" 
                  type="checkbox" 
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                  Remember me
                </label>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className={`w-full bg-blue-600 text-white py-3 rounded-md font-medium hover:bg-blue-700 transition duration-300 shadow-md ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
              >
                {isLoading ? 'Signing in...' : 'Sign in'}
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-gray-600 text-sm">
                Don't have an account?{" "}
                <a href="/register" className="text-blue-600 font-medium hover:text-blue-800 transition duration-300">
                  Create Account
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Custom animations - Add these to your global CSS file */}
      <style jsx>{`
        @keyframes float-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-20px); }
        }
        @keyframes float-medium {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-15px); }
        }
        @keyframes float-fast {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        .animate-float-slow {
          animation: float-slow 6s ease-in-out infinite;
        }
        .animate-float-medium {
          animation: float-medium 5s ease-in-out infinite;
        }
        .animate-float-fast {
          animation: float-fast 4s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}

export default Home;