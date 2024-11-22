import express from "express";
import { client } from "./utils/db.mjs";


async function init() {
    const app = express();
    const port = 4567;

    await client.connect();

app.get("/test" , (req,res) =>{
    return res.json("Server Is Working :)")
});

app.listen(port,() =>{
    console.log(`Server is running at ${port}`);
});

}

init();