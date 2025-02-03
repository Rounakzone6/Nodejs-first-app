// import http from 'http'
// // import gfName,{ gfName2, gfName3} from './features.js'
// // import * as myObj from './features.js'

// import { generateLovePercent } from './features.js'

// // import fs from 'fs'
// // const home=fs.readFileSync("./index.html")

// // import path from 'path'
// // console.log(path.extname("/home/random/index.html"))
// // console.log(path.dirname("/home/random/index.html"))

// // console.log(home)

// // console.log(gfName)
// // console.log(gfName2)
// // console.log(gfName3)

// // console.log(myObj)
// // console.log(generateLovePercent())

// // console.log(http)
// const server = http.createServer((req,res)=>{
//     // console.log(req.url)

//     // res.end("<h1>Noice</h1>")

//     if(req.url === "/about") {
//         res.end(`<h1>Love is ${generateLovePercent()}</h1>`)
//     } else if(req.url === "/") {
//         // const home=fs.readFile("./index.html",(err,home)=>{
//         //     // console.log("file read");
//         //     res.end(home)
//         //     })
//         res.end(home);
//     } else if(req.url === "/contact") {
//         res.end("<h1>Contact Page</h1>")
//     } else {
//         res.end("<h1>Page Not Found</h1>")
//     }

// })

// server.listen(5000,()=>{
//     console.log("server is working")
// })

// ************************ Express ************************

// import express from 'express'
// import fs from 'fs'
// import path from 'path'

// const app = express()

// app.get("/getproducts",(req,res,next)=>{
//     // res.send("Hi");
// res.status(400).send("Meri marzi")
//     // res.sendStatus(404)
//     // res.sendStatus(500)
//     // res.sendStatus(400)

//     res.json({
//         success: true,
//         products: []
//     })

// })

// app.get("/",(req,res)=>{
//     // const file = fs.readFileSync("./index.html")
//     const pathlocation = path.resolve()
//     // console.log(path.join(pathlocation,"nice"))
//     // res.sendFile(path.join(pathlocation,"./index.html"))

//     res.render()
// })

// app.listen(5000,()=>{
//     console.log("server is working");
// })

// ************************ EJS Turtorial ************************

import express from "express";
import path from "path";
import cookieParser from "cookie-parser";
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'

import mongoose from "mongoose";
mongoose
  .connect("mongodb://localhost:27017", {
    dbName: "backend",
  })
  .then((c) => console.log("database connected"))
  .catch((e) => console.log(e));


// // for form.ejs
// const messageSchema = new mongoose.Schema({
//   name: String,
//   email: String,
// });
// const Message = mongoose.model("Message", messageSchema);

// // for login.ejs
const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String,
});
const User = mongoose.model("User", userSchema);


const app = express();

const users = [];

// using middlewares
// console.log(path.join(path.resolve(),"public"))
app.use(express.static(path.join(path.resolve(), "public")));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser())

// setting up view engine
app.set("view engine", "ejs");

const isAuthenticated = async (req,res,next) => {
    const {token} = req.cookies
    if(token){
        const decoded = jwt.verify(token,"dfasdkhfksad")
        
        req.user = await User.findById(decoded._id)

        next()
    }else{
        res.redirect("/login")
    }
    
}

app.get("/",isAuthenticated, (req, res) => {
  // res.render("index",{name: "ravi"})

  // res.sendFile("index")
  
  // res.render("form");
  
  // res.render("login");

//   const {token} = req.cookies
//   if(token){
//       next()
//   }else{
//       res.render("login")
//   }
    console.log(req.user)
    res.render("logout",{name: req.user.name})

});

app.get("/register",(req,res)=>{
    res.render("register")
})
app.get("/login",(req,res)=>{
    res.render("login")
})

app.get("/logout", (req, res) => {
    res.cookie("token", null, {
      httpOnly: true,
      expires: new Date(Date.now()),
      secure: true,
    });
    res.redirect("/");
  });


app.post("/register", async (req, res) => {
    const { name, email, password } = req.body;

    let user = await User.findOne({email})
    if(user){
        return res.redirect("/login")
    }

    const hashedPassword = await bcrypt.hash(password,10) 


    user = await User.create({name,email,password:hashedPassword})

    const token = jwt.sign({_id:user._id},"dfasdkhfksad")
    res.cookie("token",token, {
        httpOnly: true,
        expire: new Date(Date.now()+60*1000),
        secure: true,
    });
    res.redirect("/");
});

app.post("/login", async (req, res) => {
    const { email, password } = req.body;

    let user = await User.findOne({email})
    if(!user){
        return res.redirect("/register")
    }
    const isMatch = await bcrypt.compare(password,user.password)
    if(!isMatch) return res.render("login",{email, message: "Incorrect Password"})

    const token = jwt.sign({_id:user._id},"dfasdkhfksad")
    res.cookie("token",token, {
        httpOnly: true,
        expire: new Date(Date.now()+60*1000),
        secure: true,
    });
    res.redirect("/");
});





// app.get("/success", (req, res) => {
//   res.render("success");
// });

// app.get("/add", async (req, res) => {
//   await Message.create({ name: "abhi2", email: "rk@gmail.com" });
//   res.send("Nice");
// });

// app.post("/contact", async (req, res) => {
//   // console.log(req.body.name)
//   const { name, email } = req.body;
//   const messageData = { name, email };
//   await Message.create(messageData);
//   res.redirect("/success");
// });

// app.get("/users", (req, res) => {
//   res.json({
//     users,
//   });
// });

app.listen(5000, () => {
  console.log("server is working");
});
