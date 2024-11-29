import express from "express";
import {protect} from "../middlewares/protect.mjs"
import Profile from "../modules/profiles.mjs";
import { ObjectId } from "mongodb";

const profileRouter = express.Router();

profileRouter.post("/" , [protect] , async (req,res) => {

    try{

    const { profile_pic , bio , address , gender , phone_num , birth_day } = req.body;// รับ _id จาก middlewares // 
    const newProfile = new Profile ({
        users:req.user_id, // ดึงมาจากการตั้ง fk ไว้ใน modules profiles แล้ว ใส่ req.user_id จาก protect middle wares token //
        profile_pic,
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
      console.log(err)
      return res.status(500).json({
        message: "user cannot create profile because database issue",  
      });
    };
});

profileRouter.get("/" , [protect] , async (req,res) =>{
    
    try{
    const profile = await Profile.findOne({users:req.user_id})
    
    if(!profile){
        return res.status(404).json({
            message: "User not found"
        });
    }
    
    return res.status(200).json({
       data: profile 
    });
    }catch(err){
        console.log(err)
        return res.status(404).json({
           message: "cannot read  profile because database issue",
       });
    };
});

profileRouter.put("/:userId" , [protect] , async (req,res) => {
   try{
   const userId = new ObjectId(req.params.userId)
   const { address , bio , profile_pic , birth_day , phone_num , gender } = req.body
   
   const newProfile = {
        address,
        bio,
        profile_pic,
        birth_day,
        phone_num,
        gender,
        updated_at: new Date()
   };

   await Profile.findByIdAndUpdate(
        userId,
       { $set: newProfile},
       { new :true }
   );

   
     return res.status(200).json({
        message: "Profile has been updated" 
     });
       
   }catch(err){
    console.log(err)
     return res.status(500).json({
        message: "Profile cannot updated because database issue", 
     });
   };
});
                                                                                                                                              
export default profileRouter;
