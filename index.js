const express = require("express")
const app =express()
const {connection} = require("./Config/db")
const {UserRouter} = require("./Controllers/User")
const cors = require("cors")
require("dotenv").config()
app.use(cors())
app.use(express.json())
app.use(UserRouter)
app.listen(4500,async()=>{
    try {
        await connection
        console.log('Database connected to Application');
    } catch (error) {
        console.log(error.message);
    }
    console.log(`Server is running at port ${process.env.PORT}`);
})