import { Router } from "express";
import { protect } from "../middlewares/protect.mjs";
import Post from "../modules/posts.mjs";
import { ObjectId } from "mongodb";

const postRouter = Router();

postRouter.post("/" , [protect] , async (req,res) =>{

    try{
    const { title , postBody , imageAndVdo , link , like , dislike} = req.body

    const newPost = new Post({
        users:req.user_id,
        title,
        postBody,
        imageAndVdo,
        link,
        like,
        dislike,
        created_at: new Date(),
        updated_at: new Date()
    });

    await newPost.save();

    return res.status(201).json({
        message: "Post has been created",  
    });

    }catch(err){
        console.log(err)
        return res.status(500).json({
            message: "Cannot create post because database issue",  
        });
    }
});

postRouter.get("/" , [protect] , async (req,res) => {

    try{
        
        const posts  = await Post.findOne({users:req.user_id});

        if(!posts){
            return res.status(404).json({
                message: "Post not found"
            });
        }

        return res.status(200).json({
            data: posts
        });

    }catch(err){
        return res.status(500).json({
            message: "cannot read posts because database issue",
        });
    };
});







export default postRouter;