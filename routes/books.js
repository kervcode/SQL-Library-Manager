const express = require("express");
const db = require("../db");
const router = express.Router();
const { Book } = db.models;

function asyncHandler(cb) {
  return async (req, res, next) => {
    try {
      await cb(req, res, next);
    } catch (err) {
      res.status(500).render("error", { err });
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

router.get((req, res, next) => {
  console.log("Error route has been called");

  const err = new Error();
  err.message = "Custom 500 error thrown";
  err.status = 500;
  throw err;
});

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
    const book = await Book.create(req.body);
    res.redirect("/books");
  })
);

//GET a book by ID
router.get(
  "/books/:id",
  asyncHandler(async (req, res) => {
    const book = await Book.findByPk(req.params.id);
    if (book !== {}) {
      res.render("update-book", { book, title: "Edit Book" });
    } else {
      const err = new Error();
      err.status = 404;
      err.message = "Looks like the quote you resquested does not exist.";
      next(err);
    }
  })
);

//UPDATE BOOK BY ID
router.post(
  "/books/:id",
  asyncHandler(async (req, res) => {
    const book = await Book.findByPk(req.params.id);
    if (book !== {}) {
      await book.update(req.body);
      res.redirect("/books");
    } else {
      const err = new Error();
      err.status = 404;
      err.message = "Looks like the book you resquested does not exist.";
      next(err);
    }
  })
);
//DELETE book by ID
router.get(
  "/books/:id/delete",
  asyncHandler(async (req, res) => {
    const book = await Book.findByPk(req.params.id);
    if (book !== {}) {
      res.render("/books", { book });
    } else {
      const err = new Error();
      err.status = 404;
      err.message =
        "Looks like the book you are trying to delete does not exist.";
      next(err);
    }
  })
);

router.post(
  "/books/:id/delete",
  asyncHandler(async (req, res) => {
    const book = await Book.findByPk(req.params.id);
    if (book !== {}) {
      await book.destroy();
      res.redirect("/books");
    } else {
      const err = new Error();
      err.status = 404;
      err.message =
        "Looks like the book you are trying to delete does not exist.";
      next(err);
    }
  })
);

module.exports = router;
