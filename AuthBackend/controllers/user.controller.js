import userModel from "../model/userModel.js"

export const getAllUserController=async(req,res)=>{
   try{

    const findUser=await userModel.findOne({_id:req.userId.data});
    if(!findUser){
        return res.status(200).send({
            message:"unauthorized",
            success:false
        })
    }
    const allUsers=await userModel.find({},"userName");
  
    return res.status(200).send({
        success:true,
        message:"all user are fatched",
        users:allUsers
        
    })


   }catch(err){
    res.status(200).json({
        message:"something went wrong while fetching all users",
        success:false
    })
   }
}