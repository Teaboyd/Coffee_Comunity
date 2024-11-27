import express from "express";
import {protect} from "../middlewares/protect.mjs"
import User from "../modules/users.mjs";
import Profile from "../modules/profiles.mjs";

const profileRouter = express.Router();

profileRouter.post("/" , [protect] , async (req,res) => {

    try{
    const { bio , address , gender , phone_num , birth_day } = req.body;
    const user = req.user // รับ _id จาก middlewares // 

    if(!user){
        return res.status(404).json({
                message: "User not found"
        });
    };
      
    const newProfile = new Profile ({
        user:user._id,
        bio,
        address,
        gender,
        phone_num,
        birth_day
    });

    await newProfile.save();

    return res.status(201).json({
        message: "Profile has been created",  
    });
      
    }catch(err){
      return res.status(500).json({
        message: "user cannot create profile because database issue",  
      });
    };
});
                                                                                                                                                      

export default profileRouter;
