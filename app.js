const createError = require("http-errors");
const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");

const routes = require("./routes/books");

//Importing database
// const db = require("./db");
// const books = require("./db/models/books");
// const { Book } = db.models;

const app = express();

// view engine setup

app.set("view engine", "pug");
app.use("/static", express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, "public")));

app.use("/", routes);
/* ERROR HANDLERS */
// 404 handler to catch undefined or non-existent route requests
app.use((req, res, next) => {
  console.log("404 error handler called");
  res.status(404).render("not-found", err);
});

// Global Error handler
app.use((err, req, res, next) => {
  if (err) {
    console.log("Global error handler is called");
  }

  if (err.status === 404) {
    res.status(404).render("page-not-found", { err });
  } else {
    // console.dir(err);
    err.message =
      err.message || `Sorry! It seems like something went wrong on the server.`;
    res.status(err.status || 500);
    res.render("error", { err });
  }
});
app.listen(3000, () => console.log("Server running on port 3000!"));
