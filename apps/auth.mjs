import {db} from "../utils/db.mjs";
import jwt from "jsonwebtoken";
import { Router } from "express";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import { ValidationCreateUser } from "../middlewares/user_validation.mjs";
import { protect } from "../middlewares/protect.mjs";
import { ObjectId } from "mongodb";

dotenv.config();
const authRouter = Router();

authRouter.post("/register" , [ValidationCreateUser],async (req,res) =>{
    
    try{
    
    const user = {
        username: req.body.username,
        password: req.body.password,
        email:req.body.email,
        firstName:req.body.firstName,
        lastName:req.body.lastName,
        created_at:new Date(),
        updatde_at:new Date(),
    };

    const userCollection  = db.collection("users")
    const ExistingAccount = await userCollection.findOne({$or: [{username : req.body.username},{email : req.body.email}]});
    if(ExistingAccount){
        return res.status(400).json({ message: "Username or email already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password,salt);

    const collection = db.collection("users")
    await collection.insertOne(user);

    }catch(err){
        console.log(err)
        return res.status(500).json({
            message:"server couldn't create user because database issue",
        });
    };

    return res.status(201).json({
        message: "User has been created successfully",
    });

});

authRouter.post("/login" , async (req,res) =>{

    let token;

    try{

        const user = await db.collection("users").findOne({
            username: req.body.username
        });

        if(!user){
            return res.status(404).json({
                message: "User not found"
            });
        };

        const validPassword = await bcrypt.compare(
            req.body.password,
            user.password
        );

        if(!validPassword){
            return res.status(404).json({
                message: "Password not valid"
            });
        }

        token = jwt.sign(
            { id: user.user_id},process.env.SECRET_KEY,{expiresIn:"15m",}
          );

    }catch(err){
        console.log(err)
        return res.status(500).json({
            message:"cannot login into server because database issue",
        });
    }

    return res.status(200).json({
        message: "Login Successfully",token,
    });
});

authRouter.put("/:changePass" , [protect] , async (req,res) =>{
    
    try{

        const userPass = new ObjectId(req.params.changePass);
        const { currentPassword , newPassword } = req.body // รับรหัสเดิมและรหัสใหม่ //

        // เช็คว่ามีการ Input รหัสเดิมและรหัสใหม่ เข้ามาไหม //
        if ( !currentPassword || !newPassword ){
            return res.status(404).json({
                message: "Please Input currentPassword and newPassword"
            });
        }

        const collection = db.collection("users"); // ดึงข้อมูลจาก collection users เข้าไปใส่ตัวแปร collection มาเช็ค //
        const user = await collection.findOne({_id: userPass}); // นำข้อมูลที่ดึงมา นำเข้าไปไว้ในตัวแปร user //

        // เช็คว่าข้อมูลของ user ที่ดึงมามีไหม //
        if ( !user ){
            return res.status(404).json({
                message: "User not found"
            });
        }

        // เช็คว่า password ปัจจุบัน และ ที่ user ต้องการเปลี่ยน ตรงกันไหม //
        const isValidPassword = await bcrypt.compare(currentPassword,user.password);
        if (!isValidPassword){
            return res.status(400).json({
                message: "Password doesn't match"
            });
        };

        // สร้าง hashing //
        const salt = await bcrypt.genSalt(10);
        // นำ salt มา hashed รหัสใหม่ //
        const hashedPassword = await bcrypt.hash(newPassword,salt);

        // update รหัสใหม่ โดยรับ params ของ user เข้ามา //
        await collection.updateOne(
            {
                _id: userPass
            },
            {
                $set: {
                    password: hashedPassword
                }
            }
        );

        return res.status(200).json({
            message: "Password is updated"
        });

    }catch(err){
        console.log(err)
        return res.status(500).json({
            message: "Server cannot update password because database issue",
        });
    }
});

authRouter.delete("/:userId" , [protect] , async (req,res) => {

    try{

        const collection = db.collection("users");
        const user = new ObjectId(req.params.userId);
        const userChecker = await collection.findOne({_id: user}); // นำข้อมูลที่ดึงมา นำเข้าไปไว้ในตัวแปร user //

        // เช็คว่าข้อมูลของ user ที่ดึงมามีไหม //
        if ( !userChecker ){
            return res.status(404).json({
                message: "User not found"
            });
        }
        
        await collection.deleteOne({
            _id: user
        });

    }catch(err){
        console.log(err)
        return res.status(500).json({
            message: "This user cannot be deleted because database issue"
      });
    };

    return res.status(200).json({
        message: "User delete successfully"
    });

});

export default authRouter; 