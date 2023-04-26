// Local versus host database
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config({ path: ".env" });
}

// Requires ...
const createError = require("http-errors");
const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");

// Require routers
const indexRouter = require("./routes/index");
const animalRouter = require("./routes/animal");

// Express application
const app = express();

// Database connection
const mongoose = require("mongoose");
main().catch((err) => console.log(err));
async function main() {
  await mongoose.connect(process.env.DATABASE_URL);
}

// View engine setup
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.set("layout", "layouts/layout");

// Use ...
app.use(expressLayouts);
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

// Use routers
app.use("/", indexRouter);
app.use("/animal", animalRouter);
app.use("/breeds", animalRouter);
app.use("/dogs", animalRouter);

// Catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// Error handler
const browser = {
  title: "Sdg",
  subTitle: "Animal",
  description: "Error",
};
app.use(function (err, req, res, next) {
  // Set locals, only providing error in development.
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};
  // Render the error page.
  res.status(err.status || 500);
  res.render("error", {
    browser,
  });
});

// Exports
module.exports = app;
