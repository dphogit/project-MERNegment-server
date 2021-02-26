require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const path = require("path");
const multer = require("multer");
const { v4: uuidv4 } = require("uuid");

const app = express();
const PORT = process.env.PORT;
const MONGO_URI = process.env.MONGO_URI;

const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "images");
  },
  filename: (req, file, cb) => {
    const ext = file.mimetype.split("/")[1];
    cb(null, uuidv4() + "." + ext);
  },
});

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/jpeg"
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

// Routes for middleware
const authRoutes = require("./routes/auth");
const homeRoutes = require("./routes/home");

app.use(cors());
// app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(
  multer({ storage: fileStorage, fileFilter: fileFilter }).single(
    "profilePicture"
  )
);
app.use("/images", express.static(path.join(__dirname, "images")));

// Middleware Routes
app.use("/auth", authRoutes);
app.use("/home", homeRoutes);

// Error Handling

// Connect To Database
mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
});

const db = mongoose.connection;
db.on("error", () => console.log("Error connecting to Database"));

db.once("open", () => {
  console.log("MongoDB connected...");
  app.listen(PORT, () => console.log(`Listening on Port ${PORT}...`));
});
