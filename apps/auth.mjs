import jwt from "jsonwebtoken";
import { Router } from "express";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import { ValidationCreateUser } from "../middlewares/user_validation.mjs";
import { protect } from "../middlewares/protect.mjs";
import { ObjectId } from "mongodb";
import User from "../modules/users.mjs";

dotenv.config();
const authRouter = Router();

authRouter.post("/register" , [ValidationCreateUser] , async (req,res) => {

    try{
	const { username , password , email , firstName , lastName} = req.body
	const existingAcc = await User.findOne({	
		$or: [{username},{email}],
	});

	if(existingAcc){
		return res.status(404).json({
			message: "User has existing",
		})
	}

	const salt = await bcrypt.genSalt(10);
	const hashedPass = await bcrypt.hash(password,salt);

	const newUser = new User({
		
		username,
		password: hashedPass, // hashPassword //
		email,
		firstName,
		lastName,
	});

	await newUser.save(); // add ข้อมูล // 

	return res.status(201).json({
		message: "User has been created succesfull", 
	});

     }catch(err){
	return res.status(500).json({
		message: "User could'n been create because database issue", 
	});
    }
});

authRouter.post("/login" , async (req,res) =>{

    let token;
    try{
        const { username , password } = req.body
        const user = await User.findOne({ username });

        if(!user){
            return res.status(404).json({
                message: "User not found"
            }); 
        };

        const validPassword = await bcrypt.compare(
            password,
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

authRouter.patch("/:changePass" , [protect] , async (req,res) =>{
    
    try{

        const userPass = new ObjectId(req.params.changePass);
        const { currentPassword , newPassword } = req.body // รับรหัสเดิมและรหัสใหม่ //

        // เช็คว่ามีการ Input รหัสเดิมและรหัสใหม่ เข้ามาไหม //
        if ( !currentPassword || !newPassword ){
            return res.status(404).json({
                message: "Please Input currentPassword and newPassword"
            });
        }

        const userCollection = await User.findById(userPass)
        // เช็คว่าข้อมูลของ user ที่ดึงมามีไหม //
        if ( !userCollection ){
            return res.status(404).json({
                message: "User not found"
            });
        }

        // เช็คว่า password ปัจจุบัน และ ที่ user ต้องการเปลี่ยน ตรงกันไหม //
        const isValidPassword = await bcrypt.compare(currentPassword,userCollection.password);
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
        userCollection.password = hashedPassword
        await userCollection.save();

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

        const userId = req.params.userId 
        const userChecker = User.findById({userId})// นำข้อมูลที่ดึงมา นำเข้าไปไว้ในตัวแปร user //

        // เช็คว่าข้อมูลของ user ที่ดึงมามีไหม //
        if ( !userChecker ){
            return res.status(404).json({
                message: "User not found"
            });
        }
        
        await User.findByIdAndDelete(userId);

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