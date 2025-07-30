
import userModel from "../model/userModel.js"
import generateToken from "../utils/generateToken.js";
import {hashedPassword,comparePassword} from "../utils/password.hash.js"

 export const signupController=async(req,res)=>{
  try{

    const {userName,password}= req.body;
   if(!userName || !password){
    return res.status(200).json({
        message:"Please enter username or password",
        success:false
    })
   }

   const userExist=await userModel.findOne({userName});
   if(userExist){
    return res.status(200).json({
        message:"User already exists...Please login",
        success:false
    })
   }
   
  
   const hPassword=hashedPassword(password);
   
  
   const user=new userModel({
    userName,password:hPassword
   })
    await user.save();
   
   
     const token=await generateToken(user._id,res);
    
    
    return res.status(201).json({
      message:"user created Successfully...",
      success:true,
      user:{
        userName:user.userName,
        user_id:user._id
      },
      token:token
    })

   

  }catch(err){
    res.status(500).json({
        message:"user register failed ..!",
        success:false
    })
  }
}


 export const loginController=async(req,res)=>{
  try{

    const {userName,password}= req.body;
   if(!userName || !password){
    return res.status(200).json({
        message:"Please enter username or password",
        success:false
    })
   }
   
   const userExist=await userModel.findOne({userName});
   
   if(!userExist){
    return res.status(200).json({
        message:"Please enter valid username or password",
        success:false
    })
   }
   
   const matchPassword=comparePassword(password,userExist.password);
     
   
   if(!matchPassword){
    return res.status(200).json({
      message:"Enter valid username or password",
      success:false
    })
   }
   
    const token=await generateToken(userExist._id);
   
    return res.status(200).json({
      message:"user Logged Successfully...",
      success:true,
      user:{
        userName:userExist.userName,
        user_id:userExist._id
      },
      token:token
    })

   

  }catch(err){
    res.status(500).json({
        message:"user login failed ..!",
        success:false
        
    })
  }
 }
