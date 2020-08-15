const express = require("express");
const db = require("../db");
const router = express.Router();
const { Book } = db.models;

// Async/await middleware
function asyncHandler(cb) {
  return async (req, res, next) => {
    try {
      await cb(req, res, next);
    } catch (err) {
      console.dir("error");
      console.log("error");
      res.status(500).send(error);
    }
  };
}
//Redirect "/" to "/books"
router.get(
  "/",
  asyncHandler(async (req, res) => {
    res.redirect("/books");
  })
);

//GET books listing
router.get(
  "/books",
  asyncHandler(async (req, res) => {
    const books = await Book.findAll();
    res.render("index", { books, title: "SQL Library Manager" });
  })
);

//GET new book
router.get(
  "/new_book.html",
  asyncHandler(async (req, res) => {
    res.redirect("/books/new");
  })
);
//render form for new book
router.get(
  "/books/new",
  asyncHandler(async (req, res, next) => {
    res.render("new_book", { title: "Enter New Book" });
  })
);

//POST new book
router.post(
  "/books/new",
  asyncHandler(async (req, res, next) => {
    let book;
    try {
      book = await Book.create(req.body);
      res.redirect("/books");
    } catch (error) {
      if (error.name === "SequelizeValidationError") {
        book = await Book.build(req.body);
        res.render("new_book", {
          book,
          errors: error.errors,
          title: "Enter New Book",
        });
      } else {
        throw error;
      }
    }
  })
);

//GET a book by ID
router.get(
  "/books/:id",
  asyncHandler(async (req, res) => {
    const book = await Book.findByPk(req.params.id);
    if (book) {
      res.render("update-book", { book, title: "Update Book Detail" });
    } else {
      res.sendStatus(404);
    }
  })
);

//UPDATE BOOK BY ID
router.post(
  "/books/:id",
  asyncHandler(async (req, res) => {
    let book;
    try {
      book = await Book.findByPk(req.params.id);
      if (book) {
        await book.update(req.body);
        res.redirect("/books");
      } else {
        res.redirect(404);
      }
    } catch (error) {
      if (error.name === "SequelizeValidationError") {
        book = await Book.build(req.body);
        book.id = req.params.id; // this line is to make sure the right book gets updated
        res.render("update-book", {
          book,
          errors: error.errors,
          title: "Update book detail",
        });
      } else {
        throw error;
      }
    }
  })
);
//DELETE book by ID
router.get(
  "/books/:id/delete",
  asyncHandler(async (req, res) => {
    const book = await Book.findByPk(req.params.id);
    if (book) {
      res.render("/books", { book });
    } else {
      res.sendStatus(404);
    }
    // else {
    //   const err = new Error();
    //   err.status = 404;
    //   err.message =
    //     "Looks like the book you are trying to delete does not exist.";
    //   next(err);
    // }
  })
);

router.post(
  "/books/:id/delete",
  asyncHandler(async (req, res) => {
    const book = await Book.findByPk(req.params.id);
    if (book) {
      await book.destroy();
      res.redirect("/books");
    } else {
      res.sendStatus(404);
    }
  })
);

module.exports = router;
