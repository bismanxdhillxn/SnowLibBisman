const Book = require("../models/book");
const Category = require("../models/category");
const Publisher = require("../models/publisher");
const BookReview = require("../models/bookReview");
const Customer = require("../models/customer");

// ✅ Create a new book (supports base64 image)
exports.createBook = async (req, res) => {
  try {
    const { title, price, categoryId, publisherId, image } = req.body;

    const category = await Category.findByPk(categoryId);
    const publisher = await Publisher.findByPk(publisherId);

    if (!category || !publisher) {
      return res.status(400).json({ error: "Invalid category or publisher" });
    }

    const book = await Book.create({ title, price, categoryId, publisherId, image });
    res.status(201).json(book);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ✅ Get all books with associations (including image)
exports.getBooks = async (req, res) => {
  try {
    const books = await Book.findAll({
      include: [
        { model: Category, as: "category" },
        { model: Publisher, as: "publisher" },
        { model: BookReview, as: "reviews", include: [{ model: Customer, as: "customer" }] }
      ]
    });
    res.json(books);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ✅ Get a single book by ID with associations
exports.getBook = async (req, res) => {
  try {
    const book = await Book.findByPk(req.params.id, {
      include: [
        { model: Category, as: "category" },
        { model: Publisher, as: "publisher" },
        { model: BookReview, as: "reviews", include: [{ model: Customer, as: "customer" }] }
      ]
    });

    if (!book) return res.status(404).json({ error: "Book not found" });

    res.json(book);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ✅ Update a book (supports base64 image update)
exports.updateBook = async (req, res) => {
  try {
    const { categoryId, publisherId } = req.body;

    if (categoryId) {
      const category = await Category.findByPk(categoryId);
      if (!category) return res.status(400).json({ error: "Invalid category" });
    }

    if (publisherId) {
      const publisher = await Publisher.findByPk(publisherId);
      if (!publisher) return res.status(400).json({ error: "Invalid publisher" });
    }

    const book = await Book.findByPk(req.params.id);
    if (!book) return res.status(404).json({ error: "Book not found" });

    await book.update(req.body); // Includes image if provided
    res.json(book);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ✅ Delete a book
exports.deleteBook = async (req, res) => {
  try {
    const book = await Book.findByPk(req.params.id);
    if (!book) return res.status(404).json({ error: "Book not found" });

    await book.destroy();
    res.json({ message: "Book deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
