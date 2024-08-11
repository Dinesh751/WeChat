import React from 'react'
import "./ChatUsers.css"
import axios from "axios"
import { authURL } from '../../local.setting'
import { useAuth } from '../../context/auth'
import { useState } from 'react'
import { Toaster } from 'react-hot-toast'
import toast from 'react-hot-toast'
import { useEffect } from 'react'
import { useReceiver } from '../../context/chatReceiver'
import { useNavigate } from 'react-router-dom'

const ChatUsers = () => {

  const [auth,setAuth]=useAuth();
  const [users,setUsers]=useState([]);
  const [receiver,setReceiver]=useReceiver();
  const navigate=useNavigate();


  useEffect(()=>{
    getUsers();
  },[auth])



  const getUsers=async()=>{
     try{

      const {data}=await axios.get(`${authURL}/v1/users`,{
        headers:{
          token:auth.token
        }
      });

      if(data.success){
         setUsers(data.users)
      }else{
        toast.error(data.message);
      }
      

     }catch(err){
      console.log(err);
     }
  }

  const logout = ()=>{
    try{

      localStorage.removeItem("auth");
      navigate("/");


    }catch(err){
      console.log(err)
    }
  }


  return (
    <>
    <div className="chatUserContainer">

      <div className="headerTitleContainer">
           <h4 className="header-title">WeChat </h4>
      </div>
    
    <div className="containerUser">
      {
        users.map((user)=>{
          return (
            user.userName !== auth.user.userName && <div className={`usersContainer ${receiver === user.userName ? "active":""}`} key={user._id} onClick={()=>{setReceiver(user.userName)}} >
             {user?.profilePhoto ?"":<img src="chat-bg.jpg" alt="user-image" />} 
              <span>{user.userName} </span>
            </div>
          )
        })
      }


     
      
     
      

    </div>
     
     
     
      <div className="footerContainer">
          <img src="chat-bg.jpg" alt="user-image" />
          <span>{auth?.user?.userName ?auth?.user?.userName : "User" }</span>
          <button className="logout-button" onClick={logout}>
            <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" className="bi bi-box-arrow-right" viewBox="0 0 16 16">
            <path fillRule="evenodd" d="M10 12.5a.5.5 0 0 1-.5.5h-8a.5.5 0 0 1-.5-.5v-9a.5.5 0 0 1 .5-.5h8a.5.5 0 0 1 .5.5v2a.5.5 0 0 0 1 0v-2A1.5 1.5 0 0 0 9.5 2h-8A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h8a1.5 1.5 0 0 0 1.5-1.5v-2a.5.5 0 0 0-1 0z"/>
            <path fillRule="evenodd" d="M15.854 8.354a.5.5 0 0 0 0-.708l-3-3a.5.5 0 0 0-.708.708L14.293 7.5H5.5a.5.5 0 0 0 0 1h8.793l-2.147 2.146a.5.5 0 0 0 .708.708z"/>
            </svg>
          </button>
       </div>
    </div>


  <Toaster/>
    </>
    
  )
}

export default ChatUsers