import express from "express";
import dotenv from "dotenv"

dotenv.config();

const app= express();
app._rou

app.get("/",(req,res)=>{
    res.status(200).send({
        message:"Welcome... server is running "
    })
})

app.listen(process.env.PORT || 5000, ()=>{
    console.log(`connect to server running at ${process.env.PORT}`)
})