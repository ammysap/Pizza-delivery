const express =require("express");
const app=express();
const path =require("path");
const ejs =require("ejs");
const expressLayout=require("express-ejs-layouts");
const PORT =process.env.PORT||3000

app.use(express.static('public'));
app.get("/",function(req,res)
{
    res.render('home');
});

//set template engine

app.use(expressLayout);


app.set("views",path.join(__dirname,"/resources/views"));

app.set("view engine", "ejs");

app.listen(PORT,function()
{
    console.log("server started on port 3000");
});