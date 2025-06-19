import { useEffect, useState } from "react";
import CustomerSidebar from "../components/CustomerSidebar";
import { toast, Bounce } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function Wishlist() {
  const [wishlist, setWishlist] = useState([]);
  const [customerId, setCustomerId] = useState(null);

  useEffect(() => {
    const fetchedCustomerId = 1; // Replace with actual customer ID retrieval logic
    setCustomerId(fetchedCustomerId);
  }, []);

  useEffect(() => {
    if (customerId) {
      fetchWishlist();
    }
  }, [customerId]);

  const fetchWishlist = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/wishlist?customerId=${customerId}`);
      const data = await response.json();
      setWishlist(data);
    } catch (error) {
      console.error("Error fetching wishlist:", error);
    }
  };

  const removeFromWishlist = async (wishlistId) => {
    try {
      const bookToRemove = wishlist.find((item) => item.id === wishlistId);
      if (!bookToRemove) return;
  
      const response = await fetch(`http://localhost:5000/api/wishlist/remove`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ customerId, bookId: bookToRemove.bookId }),
      });
  
      if (response.ok) {
        fetchWishlist(); // Refresh wishlist after removal
        toast.success('Item removed from wishlist.', {
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
        console.error("Failed to remove item from wishlist");
      }
    } catch (error) {
      console.error("Error removing item from wishlist:", error);
    }
    
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <CustomerSidebar />
      <main className="flex-1 p-6">
        <header className="bg-white shadow-md p-4 rounded-lg">
          <h1 className="text-lg font-semibold">Your Wishlist</h1>
        </header>

        <div className="mt-6 bg-white p-4 rounded-lg shadow">
          {wishlist.length === 0 ? (
            <p className="text-gray-500">No items in wishlist.</p>
          ) : (
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-200">
                  <th className="p-2">Title</th>
                  <th className="p-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {wishlist.map((item) => (
                  <tr key={item.id} className="border-t">
                    <td className="p-2">{item.book.title}</td>
                    <td className="p-2">
                      <button
                        onClick={() => removeFromWishlist(item.id)}
                        className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </main>
    </div>
  );
}
