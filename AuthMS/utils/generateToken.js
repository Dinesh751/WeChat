import jwt from "jsonwebtoken"
import dotenv from "dotenv"


dotenv.config();


const generateToken=async (data)=>{
try{
   const token=  jwt.sign({data}, process.env.JWT_SECRET, { expiresIn: '15d' });
   
    return token;

}catch(err){
    console.log(err);
    
}
}

export default generateToken