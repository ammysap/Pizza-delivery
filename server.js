const express = require("express");
const app = express();
const path = require("path");
const ejs = require("ejs");
const expressLayout = require("express-ejs-layouts");
const res = require("express/lib/response");
const PORT = process.env.PORT || 3000;

app.use(express.static("public"));
app.use(expressLayout);

app.set("views", path.join(__dirname, "/resources/views"));

app.set("view engine", "ejs");
app.get("/", function (req, res) {
  res.render("home");
});
app.get("/cart", function (req, res) {
  res.render("customers/cart");
});
app.get("/login", function (req, res) {
  res.render("auth/login");
});
app.get("/register", function (req, res) {
  res.render("auth/register");
});

//set template engine

app.listen(PORT, function () {
  console.log("server started on port 3000");
});
