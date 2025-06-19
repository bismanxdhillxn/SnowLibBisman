import { useEffect, useState } from "react";
// import Sidebar from "../components/Sidebar";
import { Pencil, Trash, Plus } from "lucide-react";
import { toast, Bounce } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'

export default function Books() {
  const [books, setBooks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [publishers, setPublishers] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    price: "",
    categoryId: "",
    publisherId: "",
    image: "",
  });
  const [previewImage, setPreviewImage] = useState("");
  const [editingBook, setEditingBook] = useState(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    fetchBooks();
    fetchCategories();
    fetchPublishers();
  }, []);

  const fetchBooks = async () => {
    const response = await fetch("http://localhost:5000/api/books/");
    const data = await response.json();
    setBooks(data);
  };

  const fetchCategories = async () => {
    const response = await fetch("http://localhost:5000/api/categories/");
    const data = await response.json();
    setCategories(data);
  };

  const fetchPublishers = async () => {
    const response = await fetch("http://localhost:5000/api/publishers/");
    const data = await response.json();
    setPublishers(data);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData({ ...formData, image: reader.result });
      setPreviewImage(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const method = editingBook ? "PUT" : "POST";
    const url = editingBook
      ? `http://localhost:5000/api/books/${editingBook.id}`
      : `http://localhost:5000/api/books/`;

    const response = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(formData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      toast.error(errorData.error || 'Error saving book', {
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
      return;
    }

    fetchBooks();
    setFormData({ title: "", price: "", categoryId: "", publisherId: "", image: "" });
    setPreviewImage("");
    setEditingBook(null);
    setShowForm(false);
  };

  const handleEdit = (book) => {
    setFormData({
      title: book.title,
      price: book.price,
      categoryId: book.categoryId,
      publisherId: book.publisherId,
      image: book.image || "",
    });
    setPreviewImage(book.image || "");
    setEditingBook(book);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this book?")) {
      await fetch(`http://localhost:5000/api/books/${id}`, { method: "DELETE" });
      fetchBooks();
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* <Sidebar /> */}
      <main className="flex-1 mt-20 p-6">
        <header className="bg-white shadow-md p-4 rounded-lg flex justify-between items-center">
          <h1 className="text-lg font-semibold">Book Management</h1>
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center gap-2"
            onClick={() => {
              setShowForm(true);
              setFormData({ title: "", price: "", categoryId: "", publisherId: "", image: "" });
              setPreviewImage("");
              setEditingBook(null);
            }}
          >
            <Plus size={18} /> Add Book
          </button>
        </header>

        {/* Book Table */}
        <div className="mt-6 bg-white p-4 rounded-lg shadow overflow-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-200">
                <th className="p-2">ID</th>
                <th className="p-2">Title</th>
                <th className="p-2">Price</th>
                <th className="p-2">Category</th>
                <th className="p-2">Publisher</th>
                <th className="p-2">Image</th>
                <th className="p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {books.map((book) => (
                <tr key={book.id} className="border-t">
                  <td className="p-2">{book.id}</td>
                  <td className="p-2">{book.title}</td>
                  <td className="p-2">${book.price}</td>
                  <td className="p-2">
                    {categories.find((c) => c.id === book.categoryId)?.name || "N/A"}
                  </td>
                  <td className="p-2">
                    {publishers.find((p) => p.id === book.publisherId)?.name || "N/A"}
                  </td>
                  <td className="p-2">
                    {book.image ? (
                      <img src={book.image} alt="Book" className="w-12 h-12 object-cover rounded" />
                    ) : (
                      "N/A"
                    )}
                  </td>
                  <td className="p-2 flex gap-2">
                    <button
                      onClick={() => handleEdit(book)}
                      className="text-blue-500 hover:text-blue-700"
                    >
                      <Pencil size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(book.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Book Form */}
        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-96">
              <h2 className="text-xl font-semibold mb-4">
                {editingBook ? "Edit Book" : "Add New Book"}
              </h2>
              <form onSubmit={handleSubmit}>
                <input
                  type="text"
                  name="title"
                  placeholder="Book Title"
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full border p-2 rounded mb-2"
                  required
                />
                <input
                  type="number"
                  name="price"
                  placeholder="Price"
                  value={formData.price}
                  onChange={handleChange}
                  className="w-full border p-2 rounded mb-2"
                  required
                />
                <select
                  name="categoryId"
                  value={formData.categoryId}
                  onChange={handleChange}
                  className="w-full border p-2 rounded mb-2"
                  required
                >
                  <option value="">Select Category</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
                <select
                  name="publisherId"
                  value={formData.publisherId}
                  onChange={handleChange}
                  className="w-full border p-2 rounded mb-2"
                  required
                >
                  <option value="">Select Publisher</option>
                  {publishers.map((pub) => (
                    <option key={pub.id} value={pub.id}>
                      {pub.name}
                    </option>
                  ))}
                </select>

                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="w-full mb-2"
                />
                {previewImage && (
                  <img src={previewImage} alt="Preview" className="w-24 h-24 mb-2 rounded" />
                )}

                <div className="flex gap-4 mt-4">
                  <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded">
                    {editingBook ? "Update" : "Create"}
                  </button>
                  <button
                    type="button"
                    className="bg-gray-500 text-white px-4 py-2 rounded"
                    onClick={() => {
                      setShowForm(false);
                      setEditingBook(null);
                      setFormData({ title: "", price: "", categoryId: "", publisherId: "", image: "" });
                      setPreviewImage("");
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
