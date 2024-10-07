import mongoose from "mongoose";
import multer from "multer";

const bookSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    bookImage: {
      type: String,
      required: true,
    },
    author: {
      type: String,
      required: true,
      trim: true,
    },
    genre: {
      type: String,
      required: true,
      trim: true,
    },
    availability: {
      type: Boolean,
      default: true,
      required: true,
    },
    borrowedBy: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "User",
      default: null,
    },
    created_by: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

// book image
const storage = multer.diskStorage({});
export const upload = multer({ storage: storage }).single("bookImage");

const bookModel = mongoose.model("book", bookSchema);
export default bookModel;
