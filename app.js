const createError = require("http-errors");
const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");

const routes = require("./routes/books");

const app = express();

// view engine setup
app.set("view engine", "pug");
app.use("/static", express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

// Serving static files
app.use(express.static(path.join(__dirname, "public")));

// respond to route resquest from books.js route
app.use("/", routes);

/* ERROR HANDLERS */
// 404 handler to catch undefined or non-existent route requests
app.use((req, res, next) => {
  console.log("404 error handler called");
  /** **/
  res.status(404).render("page-not-found");
});
// Global Error handler
app.use((err, req, res, next) => {
  if (err) {
    console.log("Global error handler called", err);
  }

  if (err.status === 404) {
    res.status(404).render("page-not-found", { err });
  } else {
    err.message = err.message || "Something went wrong on the server side.";
    res.status(err.status || 500).render("error", { err });
  }
});

app.listen(3000, () => console.log("Server running on port 3000!"));
