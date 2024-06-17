import jwt from "jsonwebtoken"
import dotenv from "dotenv"


dotenv.config();


const generateToken=async (data,res)=>{
try{
   const token=  jwt.sign({data}, process.env.JWT_SECRET, { expiresIn: '15d' });
     await  res.cookie("jwt", token, {
        maxAge: 15*24*60*60*1000, //miliseconds
        httpOnly: true,
        sameSite:"strict",
        secure: false
    })
 return token

}catch(err){
    console.log(err);
    
}
}

export default generateToken