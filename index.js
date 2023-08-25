const express = require("express")
const app =express()
const {connection} = require("./Config/db")
const {UserRouter} = require("./Controllers/User")
const cors = require("cors")
require("dotenv").config()
app.use(cors())
app.use(express.json())
connection.then(() => {
    console.log("Connected to MongoDB");
  }).catch((error) => {
    console.error("Error connecting to MongoDB:", error);
  });
app.use(UserRouter)
app.use("/",async(req,res)=>{
    res.send({mssg:"Welcome to backend of Pdf-Sender"})
})
module.exports ={app}