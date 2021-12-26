require("dotenv").config();
const express = require("express");
const app = express();
const path = require("path");
const ejs = require("ejs");
const expressLayout = require("express-ejs-layouts");
const res = require("express/lib/response");
const mongoose = require("mongoose");
const PORT = process.env.PORT || 3000;
const session = require("express-session");
const flash = require("express-flash");
const { collection } = require("./app/models/menu");
const MongoDbStore = require("connect-mongo");
const bodyParser =require("body-parser");
const passport = require("passport");

mongoose.connect("mongodb://localhost:27017/PizzaDb", {
  useNewUrlParser: true,
});


app.use(
  session({
    secret: process.env.COOKIE_SECRET,
    resave: false,
    store: MongoDbStore.create({
      mongoUrl: "mongodb://localhost:27017/PizzaDb",
    }),
    saveUninitialized: false,
    cookie: { maxAge: 1000 * 60 * 60 * 24 }, //24 hours
  })
);
const passportInit = require("./app/config/passport");
passportInit(passport);

app.use(passport.initialize());
app.use(passport.session());

//global middleware



app.use(bodyParser.urlencoded({extended:true}));

app.use(flash());

app.use(express.static("public"));
app.use(expressLayout);
app.use(express.json());
app.use(function (req, res, next) {
  res.locals.session = req.session;
  res.locals.user = req.user;
  next();
});

app.set("views", path.join(__dirname, "/resources/views"));

app.set("view engine", "ejs");

require("./routes/web")(app);

//set template engine

app.listen(PORT, function () {
  console.log("server started on port 3000");
});
