import React from 'react'
import "./ChatPage.css"
import {Toaster} from "react-hot-toast"
import ChatUsers from '../chatUsers/ChatUsers'
import { useReceiver } from '../../context/chatReceiver'
import { useAuth } from '../../context/auth'
import axios from 'axios'
import { backendURL } from '../../local.setting'
import { useEffect,useState } from 'react'
import { io } from 'socket.io-client';





 const ChatPage = () => {
 
  const [receiver,setReceiver]=useReceiver();
  const [auth,setAuth]=useAuth();
  const [socket,setSocket]=useState();
  const [chatMsgs,setChatMsgs]=useState([]);
  const [msg,setMsg]=useState("");
  

  function updateScroll(){
    var element = document.getElementById("scroll");
    element.scrollTop = element.scrollHeight+1;
}
  useEffect(() => {
    // Establish WebSocket connection
    const newSocket = io(backendURL,{
       query:{
         userName:auth?.user?.userName
       }
    });
    setSocket(newSocket);


    // Listen for incoming msgs
    newSocket.on('chat msg', chatMsg => {
     console.log(chatMsg)
        setChatMsgs([...chatMsgs,chatMsg])
        setTimeout(()=>{
          if(receiver) updateScroll();
        },0)
    });

return ()=> newSocket.close()
},[chatMsgs]);

  useEffect(()=>{
     getAllChat();
  },[receiver])

  const getAllChat= async ()=>{
    try{
  
        const allChats= await axios.get(`${backendURL}/v1/chat`,{
            params:{
                sender:auth.user.userName,
                receiver:receiver
            }
        })
  
        if(allChats.data.success){
            setChatMsgs(allChats.data.chat.msgs);
        }else{
            setChatMsgs([]);
        }
       
  
    }catch(err){
        console.log(err)
    }
  }

  const sendMsg= async(e)=>{
     try{

      e.preventDefault();
      const messageToBeSent={
        sender:auth.user.userName,
        receiver:receiver,
        text:msg
      }
      if(socket){
         socket.emit('chat msg',messageToBeSent)
         setChatMsgs([...chatMsgs,messageToBeSent])
        setMsg("")
        
      }
      setTimeout(()=>{
        updateScroll();
      },0)
      
      

     }catch(err){
      console.log(err)
     }
  }

  return (
    <>
    
    <div className=" wrapper">
        <div className="chat-users"><ChatUsers/></div>
        <div className="chat">
          { receiver &&
          <div className="allChats " id="scroll">

            {chatMsgs.map((msg, index) => (

             <div key={index} className={`${msg.sender === auth.user.userName ? "chatSender":"chatReceiver"}`}>
                 <span className={`${msg.sender === auth.user.userName ? "":"receiverChat"}`}>
                  <div style={{marginLeft:"0",color:"rgba(106, 17, 203, 1)"}}><small><b>{`${msg.sender === auth.user.userName ? "":msg.sender}`}</b></small></div>
                  {msg.text}
                  </span>
             </div>
             
             
         ))}
            
          </div>}

          <div className="text-box-container">
          <form>
             <input type="text" className="text-field" value={msg} onChange={(e)=>{setMsg(e.target.value)}}  id="formGroupExampleInput2" placeholder="Type your text here"/>
             <button type="submit" className="send-btn" onClick={sendMsg} disabled={receiver.length === 0 || msg.length === 0}>Send</button>
               </form>
          </div>
        </div>
    </div>
  
  
   <Toaster/>

    </>
  
  )
}

export default ChatPage