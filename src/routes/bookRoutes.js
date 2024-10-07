import { Router } from "express";
import {
  borrowBook,
  createBook,
  deleteBook,
  getAllBooks,
  getBook,
  getBorrowedBooks,
  myBooks,
  returnBook,
  updateBook,
} from "../controllers/bookController.js";
import { upload } from "../models/bookModel.js";
const routes = Router();

// Book routes

// create book
routes.post("/", upload, createBook);

// get all books
routes.get("/", getAllBooks);

// get book by id
routes.get("/:id", getBook);

// update book data by id
routes.patch("/:id", upload, updateBook);

// delete book by id
routes.delete("/:id", deleteBook);

// borrow a book
routes.post("/borrow/:id", borrowBook);

// return a book
routes.post("/return/:id", returnBook);

// get list books borrowed by authenticated user
routes.get("/borrowed/all", getBorrowedBooks);

// user created books
routes.get("/myBooks/all", myBooks);

export default routes;
