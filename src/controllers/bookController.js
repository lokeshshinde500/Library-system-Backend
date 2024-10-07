import bookModel from "../models/bookModel.js";
import { uploadImage } from "../utils/uploadImage.js";

// create book//
export const createBook = async (req, res) => {
  try {
    const { title, author, genre } = req.body;

    // all fields are required
    if (!title || !author || !genre) {
      return res
        .status(400)
        .json({ message: "All fields are required!", success: "false" });
    }

    // image
    let image = req.file;
    if (!image) {
      return res
        .status(400)
        .json({ message: "book image required!", success: "false" });
    }

    const result = await uploadImage(image.path);

    // create new book
    const newBook = {
      title,
      author,
      bookImage: result.secure_url,
      genre,
      created_by: req.user.id,
    };

    const createBook = await bookModel.create(newBook);

    return res.status(201).json({
      message: "Book added successfully.",
      data: createBook,
      success: "true",
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Internal Server error!", success: "false" });
  }
};

// get all books //
export const getAllBooks = async (req, res) => {
  try {
    // filter queries

    const books = await bookModel.find().populate({
      path: "borrowedBy",
      select: "name -_id",
    });

    if (!books) {
      return res
        .status(404)
        .json({ message: "Books not found!", success: "false" });
    }

    return res.status(200).json({ data: books, success: "true" });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Internal Server error!", success: "false" });
  }
};

// get book by id //
export const getBook = async (req, res) => {
  try {
    const book = await bookModel.findById(req.params.id).populate({
      path: "borrowedBy",
      select: "name -_id",
    });

    if (!book) {
      return res
        .status(404)
        .json({ message: "Book not found!", success: "false" });
    }

    return res.status(200).json({ data: book, success: "true" });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Internal Server error!", success: "false" });
  }
};

// update book data by id //
export const updateBook = async (req, res) => {
  try {
    const book = await bookModel.findById(req.params.id);

    if (!book) {
      return res
        .status(404)
        .json({ message: "Book not found!", success: "false" });
    }

    const { title, author, genre, availability } = req.body;

    // image
    let image = { secure_url: "" };
    if (req.file) {
      try {
        image = await uploadImage(req.file.path);
      } catch (uploadError) {
        return res
          .status(500)
          .json({ message: "Image upload failed!", success: "false" });
      }
    }

    book.title = title || book.title;
    book.author = author || book.author;
    book.genre = genre || book.genre;
    book.bookImage = image.secure_url || book.bookImage;
    book.availability = availability || book.availability;

    const updatedBook = await book.save({ new: true });

    return res.status(200).json({
      message: "book updated successfully.",
      data: updatedBook,
      success: "true",
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Internal Server error!", success: "false" });
  }
};

// delete book by id //
export const deleteBook = async (req, res) => {
  try {
    const book = await bookModel.findByIdAndDelete(req.params.id);

    if (!book) {
      return res
        .status(404)
        .json({ message: "Book not found!", success: "false" });
    }

    return res
      .status(200)
      .json({ message: "Book deleted successfully.", success: "true" });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Internal Server error!", success: "false" });
  }
};

// borrow a book by id //
export const borrowBook = async (req, res) => {
  try {
    const isBorrowed = await bookModel.findById(req.params.id);

    if (isBorrowed.availability != true) {
      return res
        .status(404)
        .json({ message: "This book is already borrowed!", success: "false" });
    }

    const books = await bookModel.findByIdAndUpdate(req.params.id, {
      borrowedBy: req.user.id,
      availability: false,
    });

    if (!books) {
      return res
        .status(404)
        .json({ message: "Book not found!", success: "false" });
    }

    return res
      .status(200)
      .json({ message: "Book borrowed successfully.", success: "true" });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Internal Server error!", success: "false" });
  }
};

// return a book by id //
export const returnBook = async (req, res) => {
  try {
    const books = await bookModel.findByIdAndUpdate(req.params.id, {
      borrowedBy: null,
      availability: true,
    });

    if (!books) {
      return res
        .status(404)
        .json({ message: "Book not found!", success: "false" });
    }

    return res
      .status(200)
      .json({ message: "Book returned successfully.", success: "true" });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Internal Server error!", success: "false" });
  }
};

// get list books borrowed by authenticated user //
export const getBorrowedBooks = async (req, res) => {
  try {
    const books = await bookModel.find({ borrowedBy: req.user.id });

    if (!books.length) {
      return res
        .status(404)
        .json({ message: "No books are borrowed!", success: "false" });
    }

    return res.status(200).json({ data: books, success: "true" });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Internal Server error!", success: "false" });
  }
};

// user created books
export const myBooks = async (req, res) => {
  try {
    const books = await bookModel.find({created_by: req.user.id,}).populate({
      path: "borrowedBy",
      select: "name -_id",
    });

    if (!books) {
      return res
        .status(404)
        .json({ message: "Books not found!", success: "false" });
    }

    return res.status(200).json({ data: books, success: "true" });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Internal Server error!", success: "false" });
  }
};
