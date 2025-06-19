import { useEffect, useState } from "react";
import CustomerSidebar from "../components/CustomerSidebar";
import { Heart } from "lucide-react";
import { toast, Bounce } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function CustomerBooks() {
  const [books, setBooks] = useState([]);
  const [cart, setCart] = useState([]);
  const [customerId, setCustomerId] = useState(null);
  const [wishlist, setWishlist] = useState([]);

  useEffect(() => {
    // Simulating authentication; replace with actual logic
    const fetchedCustomerId = 1; // Replace with actual customer ID retrieval logic
    setCustomerId(fetchedCustomerId);
  }, []);

  useEffect(() => {
    if (customerId) {
      fetchBooks();
      fetchCart();
      fetchWishlist();  // Make sure to fetch wishlist items when the customer ID is set
    }
  }, [customerId]);

  // Fetch Books
  const fetchBooks = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/books/");
      const data = await response.json();
      setBooks(data);
    } catch (error) {
      console.error("Error fetching books:", error);
    }
  };

  // Fetch Cart Items
  const fetchCart = async () => {
    if (!customerId) return;

    try {
      const response = await fetch(`http://localhost:5000/api/cart?customerId=${customerId}`);
      const data = await response.json();
      setCart(data);
    } catch (error) {
      console.error("Error fetching cart:", error);
    }
  };

  // Fetch Wishlist Items
  const fetchWishlist = async () => {
    if (!customerId) return;
    try {
      const response = await fetch(`http://localhost:5000/api/wishlist?customerId=${customerId}`);
      const data = await response.json();
      setWishlist(data);
    } catch (error) {
      console.error("Error fetching wishlist:", error);
    }
  };

  // Add to Wishlist
  const addToWishlist = async (bookId) => {
    if (!customerId) return;

    const existingItem = wishlist.find((item) => item.bookId === bookId);
    if (existingItem) {
      // If item is already in wishlist, remove it
      await removeFromWishlist(existingItem.id);
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/wishlist/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ customerId, bookId }),
      });

      if (response.ok) {
        fetchWishlist();
        toast.success('Added to Wishlist!', {
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
    } catch (error) {
      console.error("Error adding to wishlist:", error);
    }
  };

  // Remove from Wishlist
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
        fetchWishlist(); 
        toast.success('Item removed from wishlist.', {
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
      } else {
        console.error("Failed to remove item from wishlist");
      }
    } catch (error) {
      console.error("Error removing item from wishlist:", error);
    }
  };

  // Add to Cart
  const addToCart = async (bookId) => {
    if (!customerId) return;

    const existingItem = cart.find((item) => item.bookId === bookId);
    
    if (existingItem) {
      updateCartItem(existingItem.id, customerId, bookId, existingItem.quantity + 1);
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/cart/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ customerId, bookId, quantity: 1 }),
      });

      if (response.ok) {
        fetchCart();
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
    }
  };

  // Update Cart Item
  const updateCartItem = async (cartId, customerId, bookId, quantity) => {
    if (!customerId || !bookId) {
      console.error("Invalid customerId or bookId.");
      return;
    }

    if (quantity < 1) {
      removeFromCart(cartId, customerId, bookId);
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/api/cart/${cartId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ customerId, bookId, quantity }),
      });

      if (response.ok) {
        fetchCart();
      }
    } catch (error) {
      console.error("Error updating cart:", error);
    }
  };

  // Remove from Cart
  const removeFromCart = async (cartId, customerId, bookId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/cart/${cartId}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ customerId, bookId }),
      });

      if (response.ok) {
        fetchCart();
      }
    } catch (error) {
      console.error("Error removing from cart:", error);
    }
  };

  // Checkout Function
  const handleCheckout = () => {
    toast.success('Proceeding to checkout...', {
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
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <CustomerSidebar />
      <main className="flex-1 p-6">
        <header className="bg-white shadow-md p-4 rounded-lg">
          <h1 className="text-lg font-semibold">Available Books</h1>
        </header>

        {/* Books Listing */}
        <div className="mt-6 bg-white p-4 rounded-lg shadow">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-200">
                <th className="p-2">Title</th>
                <th className="p-2">Category</th>
                <th className="p-2">Publisher</th>
                <th className="p-2">Price</th>
                <th className="p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {books.map((book) => (
                <tr key={book.id} className="border-t">
                  <td className="p-2">{book.title}</td>
                  <td className="p-2">{book.category.name}</td>
                  <td className="p-2">{book.publisher.name}</td>
                  <td className="p-2">${book.price}</td>
                  <td className="p-2">
                    <button
                      onClick={() => addToCart(book.id)}
                      className="bg-blue-500 text-white px-3 py-1 rounded"
                    >
                      Add to Cart
                    </button>
                    <button
                      onClick={() => addToWishlist(book.id)}
                      className={`px-3 py-1 rounded ${
                        wishlist.find((item) => item.bookId === book.id) 
                          ? "bg-red-500 text-white" 
                          : "bg-gray-500 text-white"
                      }`}
                    >
                      <Heart size={16} className="inline-block mr-1" />
                      {wishlist.find((item) => item.bookId === book.id) ? "Remove from Wishlist" : "Add to Wishlist"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Cart Section */}
        <div className="mt-6 bg-white p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-2">Your Cart</h2>
          {cart.length === 0 ? (
            <p className="text-gray-500">Your cart is empty.</p>
          ) : (
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-200">
                  <th className="p-2">Title</th>
                  <th className="p-2">Quantity</th>
                  <th className="p-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {cart.map((item) => (
                  <tr key={item.id} className="border-t">
                    <td className="p-2">
                      {books.find((b) => b.id === item.bookId)?.title || "Unknown"}
                    </td>
                    <td className="p-2 flex items-center">
                      <button 
                        className="bg-gray-300 px-2 py-1 rounded" 
                        onClick={() => updateCartItem(item.id, customerId, item.bookId, item.quantity - 1)}
                      >
                        -
                      </button>
                      <span className="mx-2">{item.quantity}</span>
                      <button 
                        className="bg-gray-300 px-2 py-1 rounded" 
                        onClick={() => updateCartItem(item.id, customerId, item.bookId, item.quantity + 1)}
                      >
                        +
                      </button>
                    </td>
                    <td className="p-2">
                      <button
                        onClick={() => removeFromCart(item.id, customerId, item.bookId)}
                        className="bg-red-500 text-white px-3 py-1 rounded"
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

        {/* Checkout Button */}
        {cart.length > 0 && (
          <div className="mt-4 text-right">
            <button
              onClick={handleCheckout}
              className="bg-green-500 text-white px-4 py-2 rounded"
            >
              Proceed to Checkout
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
