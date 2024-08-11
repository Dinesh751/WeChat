import jwt from "jsonwebtoken"

export const verifyToken=async (req,res,next)=>{

    const token=req.headers.token;
      

    try{
      if(token){
        const encodeToken=jwt.verify(token,process.env.JWT_SECRET);
        req.userId=encodeToken;
        next();
      }else{
        res.status(401).send({
            success:false,
            message:"not allowed"
        })
      }
        
    }catch(err){
        res.status(200).json({
            success:false,
            message:"Invalid token"
        })
    }
   
}