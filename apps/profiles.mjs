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

profileRouter.get("/" , [protect] , async (req,res) =>{
    
    try{
    const profile = await Profile.findOne({user:req.user._id})

    if(!profile){
        return res.status(404).json({
            message: "User not found"
        });
    }
    
    return res.status(200).json({
       data: profile 
    });
    }catch(err){
        return res.status(404).json({
           message: "Profile cannot read because database issue",
       });
    };
});

profileRouter.put("/:userId" , [protect] , async (req,res) => {
   try{
   const userId = new ObjectId(req.params.userId)
       
   const newProfile = {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        address: req.body.address,
        bio: req.body.bio,
        profile_pic: req.body.profile_pic,
        birth_day: req.body.birth_day,
        updated_at: new Date()
   };

   const updateProfile = await Profile.findByIdAndUpdate(
        profile,
       { $set: update},
       { new :true }
   );
       
     return res.status(200).json({
        message: "Profile has been updated" 
     });
       
   }catch(err){
     return res.status(500).json({
        message: "Profile cannot updated because database issue", 
     });
   };
});
                                                                                                                                                      

export default profileRouter;
