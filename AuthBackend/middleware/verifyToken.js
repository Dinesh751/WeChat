import jwt from "jsonwebtoken"

export const verifyToken=(req,res,next)=>{

    const token=req.cookies.jwt;
    if(!token){
        return res.status(200).json({
            message:"Please enter the token",
            success:false
        })
    }

    try{

        const encodeToken=jwt.verify(token,process.env.JWT_SECRET);
        req.userId=encodeToken;
        next();

    }catch(err){
        res.status(200).json({
            success:false,
            message:"Invalid token"
        })
    }
   
}