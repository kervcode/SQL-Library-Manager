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
//Redirect "/" to "/books"
app.get("/", (req, res) => {
  res.redirect("/books");
});

//GET books listing
app.get("/books", async (req, res) => {
  const books = await Book.findAll();
  res.render("index", { books });
});
//GET new book
app.get("/new_book.html", async (req, res) => {
  res.redirect("/books/new");
});

app.get("/books/new", async (req, res, next) => {
  res.render("new_book");
});

//POST new book
app.post("/books/new", async (req, res, next) => {
  const title = req.body.title;
  const author = req.body.author;
  const genre = req.body.genre;
  const year = req.body.year;

  const book = await Book.create({
    title,
    author,
    genre,
    year,
  });
  res.redirect("/books");
});
//GET a book by ID
app.get("/books/:id", async (req, res) => {
  const id = req.params.id;
  console.dir(id);
  const book = await Book.findByPk(id);
  console.dir(book.title);
  res.render("new_book", { book });
});
//UPDATE BOOK BY ID
//DELETE book by ID

app.listen(3000, () => console.log("Server running on port 3000!"));
