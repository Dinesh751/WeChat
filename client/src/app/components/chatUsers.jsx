import React from "react";
import axios from "axios"
import { useUsersStore } from "../zustand/useUsersStore";
import { authServerLink } from "../serverLink";
import { useEffect } from "react";
import { useChatReceiverStore } from "../zustand/userChatReceiverStore";



const chatUsers = () => {

    const {users,updateUsers}=useUsersStore();
    const {chatReceiver,updateChatReceiver}=useChatReceiverStore()


    useEffect(()=>{
        getAllUsers()
    },[])

    const getAllUsers=async (req,res)=>{
        try{

            const users=await axios.get(`${authServerLink}/v1/users`,{
                withCredentials: true
            }
);

            if(users.data.success){
                updateUsers(users.data?.users)
            }

        }catch(err){
            console.log(err)
        }
    }

  return (
    <div>
    {users.map((user, index) => (
        <div key={index} onClick={()=>{updateChatReceiver(user.userName)}}  className='bg-slate-400 rounded-xl m-2 p-2'>
                {user.userName}
        </div>
    ))}
</div>
  )
}

export default chatUsers