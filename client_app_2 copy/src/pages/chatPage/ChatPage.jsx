import React, { useEffect, useState, useCallback } from 'react';
import "./ChatPage.css";
import { Toaster } from "react-hot-toast";
import toast from "react-hot-toast";
import ChatUsers from '../chatUsers/ChatUsers';
import { useReceiver } from '../../context/chatReceiver';
import { useAuth } from '../../context/auth';
import axios from 'axios';
import { backendURL } from '../../local.setting';
import { io } from 'socket.io-client';
import DefaultPage from './DefaultPage';

const ChatPage = () => {
  const [receiver, setReceiver] = useReceiver();
  const [auth] = useAuth();
  const [socket, setSocket] = useState(null);
  const [chatMsgs, setChatMsgs] = useState([]);
  const [msg, setMsg] = useState("");

  const updateScroll = useCallback(() => {
    const element = document.getElementById("scroll");
    if (element) {
      element.scrollTop = element.scrollHeight;
    }
  }, []);

  useEffect(() => {
    const newSocket = io(backendURL, {
      query: {
        userName: auth?.user?.userName
      },
      reconnection: true,
      reconnectionAttempts: Infinity,
      reconnectionDelay: 1000, // Start with 1 second delay
      reconnectionDelayMax: 5000, // Maximum delay of 5 seconds
    });
    setSocket(newSocket);

    newSocket.on('chat msg', (chatMsg) => {
      setChatMsgs((prevMsgs) => [...prevMsgs, chatMsg]);
      if (receiver) updateScroll();
    });

    newSocket.on('connect_error', () => {
      console.error("Unable to connect to the chat server. Please check your connection."); // Updated toast message
    });

    setInterval(() => {
      newSocket.emit('heartbeat');
    }, 20000); // Every 20 seconds

    return () => newSocket.close();
  }, [auth?.user?.userName, receiver]);

  useEffect(() => {
    if (receiver) {
      getAllChat();
    }
  }, [receiver]);

  const getAllChat = async () => {
    try {
      const response = await axios.get(`${backendURL}/v1/chat`, {
        params: {
          sender: auth.user.userName,
          receiver: receiver
        }
      });

      if (response.data.success) {
        setChatMsgs(response.data.chat.msgs);
      } else {
        setChatMsgs([]);
        toast.info("No chat history found with this user."); // Updated toast message
      }
    } catch (err) {
      toast.error("Error fetching chat history. Please try again later."); // Updated toast message
      console.error(err);
      setChatMsgs([]);
    }
  };

  const sendMsg = async (e) => {
    e.preventDefault();
    if (!msg.trim()) return;

    const messageToBeSent = {
      sender: auth.user.userName,
      receiver: receiver,
      text: msg,
    };

    try {

      console.log("message to be sent ->" + messageToBeSent)
      // Send the message to the backend
      const response = await axios.post(`${backendURL}/v1/chat`, messageToBeSent);

      if (response.data.success) {
        // Update the UI
        setChatMsgs((prevMsgs) => [...prevMsgs, messageToBeSent]);
        setMsg("");
        updateScroll();
        toast.success("Message sent successfully.");

        // Emit the message via WebSocket
        try {
          if (socket) {
            socket.emit('chat msg', messageToBeSent);
          } else {
            toast.error("Real-time delivery failed. Message saved in the database.");
          }
        } catch (socketError) {
          console.error("WebSocket error:", socketError);
          toast.error("Real-time delivery failed. Message saved in the database.");
        }
      } else {
        toast.error("Failed to send the message. Please try again.");
      }
    } catch (err) {
      toast.error("Failed to send the message. Please try again.");
      console.error(err);
    }
  };

  return (
    <>
      <div className="wrapper">
        <div className="chat-users">
          <ChatUsers />
        </div>
        <div className="chat">
          {receiver ? (
            <div className="allChats" id="scroll">
              {chatMsgs.map((msg, index) => (
                <div
                  key={index}
                  className={`${
                    msg.sender === auth.user.userName ? "chatSender" : "chatReceiver"
                  }`.trim()}
                >
                  <span
                    className={`${
                      msg.sender === auth.user.userName ? "" : "receiverChat"
                    }`.trim()}
                  >
                    <div
                      style={{ marginLeft: "0", color: "rgba(106, 17, 203, 1)" }}
                    >
                      <small>
                        <b>{
                          msg.sender === auth.user.userName ? "" : msg.sender
                        }</b>
                      </small>
                    </div>
                    {msg.text}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <DefaultPage />
          )}

          {receiver && (
            <div className="text-box-container"> {/* Corrected class name */}
              <form>
                <input
                  type="text"
                  className="text-field"
                  value={msg}
                  onChange={(e) => setMsg(e.target.value)}
                  id="formGroupExampleInput2"
                  placeholder="Type your text here"
                />
                <button
                  type="submit"
                  className="send-btn"
                  onClick={sendMsg}
                  disabled={!receiver || !msg.trim()}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    fill="currentColor"
                    viewBox="0 0 16 16"
                    className="send-icon"
                  >
                    <path d="M15.854.146a.5.5 0 0 1 .11.54l-6 14a.5.5 0 0 1-.94-.002L7.25 10.75 2.5 8.5a.5.5 0 0 1 .002-.94l14-6a.5.5 0 0 1 .352-.414zM6.832 9.445l1.767 4.122L14.611 2.39 6.832 9.445zM6.5 8.5L2.39 6.611l4.122 1.767L11.5 4.5 6.5 8.5z" />
                  </svg>
                </button>
              </form>
            </div>
          )}
        </div>
      </div>

      <Toaster />
    </>
  );
};

export default ChatPage;