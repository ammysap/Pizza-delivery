require("dotenv").config();
const express = require("express");
const serverless = require("serverless-http");
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
const Emitter = require("events");

try{
  mongoose.connect(process.env.MONGO_CONNECTION_URL, {
    useNewUrlParser: true,
  });
  const connection = mongoose.connection;
  connection.once("open", () => { 
    console.log("Database connected...");
  });
}catch(err){
  console.log("Error in connecting to database");
  console.log(err);
}
mongoose.connect(process.env.MONGO_CONNECTION_URL, {
  useNewUrlParser: true,
});

//Event emmiter

const eventEmitter = new Emitter();
app.set("eventEmitter",eventEmitter);

//Session config
const store = new MongoDbStore({
  mongoUrl: process.env.MONGO_CONNECTION_URL,
  mongoOptions: {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  collectionName: "sessions", // Optional, specifies the collection name for storing sessions
  autoRemove: "interval", // Optional, removes expired sessions automatically
  autoRemoveInterval: 10, // In minutes, the interval for removing expired sessions
  secret: process.env.COOKIE_SECRET,
});

app.use(
  session({
    secret: process.env.COOKIE_SECRET,
    resave: false,
    store: store,
    saveUninitialized: false,
    cookie: { maxAge: 1000 * 60 * 60 * 24 }, //24 hours
  })
);
const passportInit = require("./app/config/passport");
passportInit(passport);

app.use(passport.initialize());
app.use(passport.session());




app.use(bodyParser.urlencoded({extended:true}));

app.use(flash());

app.use(express.static("public"));
app.use(expressLayout);
app.use(express.json());
//global middleware
app.use(function (req, res, next) {
  res.locals.session = req.session;
  res.locals.user = req.user;
  next();
});

app.set("views", path.join(__dirname, "/resources/views"));

app.set("view engine", "ejs");

require("./routes/web")(app);

//set template engine

const server= app.listen(PORT, function () {
  console.log("server started on port ", PORT);
});



//Socket

const io = require("socket.io")(server);
io.on("connection",function(socket)
{
  // Join
  socket.on("join",function(orderId)
  {
    socket.join(orderId);
  })
  
})


eventEmitter.on("orderUpdated",function(data)
{
  io.to(`order_${data.id}`).emit("orderUpdated",data);
})


eventEmitter.on("orderPlaced",function(data)
{
  io.to("adminRoom").emit("orderPlaced",data);
})
 
module.exports.handler = serverless(app);