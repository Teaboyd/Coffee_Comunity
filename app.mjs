import express from "express";
import { client } from "./utils/db.mjs";
import authRouter from "./apps/auth.mjs"
import mongoose from "mongoose";


async function init() {
    const app = express();
    const port = 4567;

    await client.connect();
    app.use(express.json());
    app.use("/auth",authRouter);

    app.get("/" , (req,res) => {
        return res.json("Welcome to My Project")
    })

    app.get("/test" , (req,res) =>{
        return res.json("Server Is Working :)")
    });

    app.listen(port,() =>{
        console.log(`Server is running at ${port}`);
    });

}

init();