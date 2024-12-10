import { Router } from "express";
import { protect } from "../middlewares/protect.mjs";
import Post from "../modules/posts.mjs";
import { uploadPosts } from "../middlewares/upload.mjs";

const postRouter = Router();

postRouter.post("/" , [protect , uploadPosts] , async (req,res) =>{

    try{
    const { title , postBody , link , like , dislike} = req.body
    let picturePath = null; 

    if(req.file){
        picturePath = req.file.path
    }

    const newPost = new Post({
        users:req.user_id,
        title,
        postBody,
        imageAndVdo:picturePath,
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

postRouter.put("/:postId" , [protect] , async (req,res) =>{

    try{
    const {postId} = req.params
    const postChecker = await Post.findById(postId);


    if ( !postChecker ){
        return res.status(404).json({
            message: "Post not found"
        });
    };

    const { title , postBody , imageAndVdo , link ,  product_pic } = req.body

    await Post.findByIdAndUpdate(
        postId,
        {
            $set: {
                product_pic,
                title,
                postBody,
                imageAndVdo,
                link,
                updated_at: new Date()
            }
        },
        {new : true},
    );

    return res.status(201).json({
        message: "Post has been updated"
    });

    }catch(err){
        console.log(err)
        return res.status(500).json({
           message: "Post cannot updated because database issue", 
        });
    }

});

postRouter.delete("/:postId" , [protect] , async (req,res) => { 
    
    try{
        const postId = req.params.postId
        const postChecker = Post.findById({postId});

        if ( !postChecker ){
            return res.status(404).json({
                message: "Post not found"
            });
        };

        await Post.findByIdAndDelete(postId);

    }catch(err){
        console.log(err)
        return res.status(500).json({
            message: "This post cannot be deleted because database issue"
      });
    };

    return res.status(200).json({
        message: "Post delete successfully"
    });

});

export default postRouter;