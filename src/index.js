import express from "express";
import cors from "cors"
import constant from "./config/constant.js";
import db from "./config/db.js";
import indexRoutes from "./routes/indexRoutes.js"

const app = express();
const port = constant.PORT;

// cors
app.use(cors());

// for json data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// create server
app.listen(port, () => {
  console.log(`Server running on Port ${port}.`);
  db();
});

// api routes
app.use("/api",indexRoutes);
