
import conversation from "../models/chat.model.js";


export const addMsgToConversation=async (participants,msg)=>{
   try{
    
    let conver= await conversation.findOne({users:{$all:participants}});
   

    if(!conver){
         conver= await conversation.create({users:participants});
        
    }
        conver.msgs.push(msg);
        await conver.save();
        
   }catch(err){
    console.log(err);
   }
}


 export const getChatController=async(req,res)=>{
    try{

       const {sender,receiver}=req.query;

       const chat=await conversation.findOne({users:{$all:[sender,receiver]}});
       console.log(chat)
       if(!chat){
           return res.status(200).send({
               message:"there is no chat",
               success:false
           })
       }
       return res.status(200).send({
           message:"chat fetched successfully",
           success:true,
           chat
       })


    }catch(err){
       res.status(500).send({
           message:"Something went wrong",
           success:false
       })
    }
}

