import jwt from 'jsonwebtoken';
import User from "../modules/users.mjs";

export const protect = async (req,res,next) => {
        const token = req.headers.authorization

    if(!token || !token.startsWith('Bearer')){
        return res.status(401).json({
            message:"Token has invalid format"
        });
    }

    const tokenWithoutBearer = token.split(" ")[1];

    try{
    const decode = jwt.verify(tokenWithoutBearer,process.env.SECRET_KEY)
    const user = await User.findById(decode.id);
    if(!user){
        return res.status(404).json({
                message: "User not found"
        });
    };

        req.user = user
        next();
    }catch(err){
        return res.status(401).json({
                message: "Token is invalid"
        });
    };
}   
