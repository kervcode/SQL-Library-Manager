const createError = require("http-errors");
const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");

//Importing database
const db = require("./db");
const books = require("./db/models/books");
const { Book } = db.models;

const app = express();

// view engine setup

app.set("view engine", "pug");
app.use("/static", express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, "public")));

function asyncHandler(cb) {
  return async (req, res, next) => {
    try {
      await cb(req, res, next);
    } catch (error) {
      res.status(500).send(error);
    }
  };
}
//Redirect "/" to "/books"
app.get(
  "/",
  asyncHandler(async (req, res) => {
    res.redirect("/books");
  })
);

//GET books listing
app.get(
  "/books",
  asyncHandler(async (req, res) => {
    const books = await Book.findAll();
    res.render("index", { books, title: "SQL Library Manager" });
  })
);

//GET new book
app.get(
  "/new_book.html",
  asyncHandler(async (req, res) => {
    res.redirect("/books/new");
  })
);
//render form for new book
app.get(
  "/books/new",
  asyncHandler(async (req, res, next) => {
    res.render("new_book", { title: "Enter New Book" });
  })
);

//POST new book
app.post(
  "/books/new",
  asyncHandler(async (req, res, next) => {
    const book = await Book.create(req.body);
    res.redirect("/books");
  })
);

//GET a book by ID
app.get(
  "/books/:id",
  asyncHandler(async (req, res) => {
    const book = await Book.findByPk(req.params.id);
    res.render("update-book", { book, title: "Edit Book" });
  })
);

//UPDATE BOOK BY ID
app.post(
  "/books/:id",
  asyncHandler(async (req, res) => {
    const book = await Book.findByPk(req.params.id);
    await book.update(req.body);
    res.redirect("/books");
  })
);
//DELETE book by ID
app.get(
  "/books/:id/delete",
  asyncHandler(async (req, res) => {
    const book = await Book.findByPk(req.params.id);
    res.render("/books", { book });
  })
);

app.post(
  "/books/:id/delete",
  asyncHandler(async (req, res) => {
    const book = await Book.findByPk(req.params.id);
    await book.destroy();
    res.redirect("/books");
  })
);
app.listen(3000, () => console.log("Server running on port 3000!"));
