import express from "express"
import dotenv from "dotenv"
import { connectDB } from "./lib/db.js";    
dotenv.config(); 

const app = express(); 
const port = process.env.PORT; 

app.listen(port, () => {
    connectDB(); 
    console.log(`Server Running on Port: ${port}`)
})
