import express from "express";
import connectDB from "./utils/db.mjs";
import authRouter from "./apps/auth.mjs"
import profileRouter from "./apps/profiles.mjs";
import postRouter from "./apps/posts.mjs";
import productRouter from "./apps/products.mjs";
import cartRouter from "./apps/carts.mjs";
import cors from "cors"


async function init() {
    const app = express();
    const port = 4567;

    await connectDB();

    app.use(express.json());
    app.use(cors());
    app.use("/auth",authRouter);
    app.use("/profile",profileRouter);
    app.use("/post",postRouter);
    app.use("/product",productRouter);
    app.use("/cart",cartRouter);

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