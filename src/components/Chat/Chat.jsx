import React, { useEffect, useState } from "react";
import close from "../../assets/close.svg";
import queryString from "query-string";
import ReactEmoji from 'react-emoji'
import { useLocation } from "react-router-dom";
import io from "socket.io-client";
import ScrollToBottom  from 'react-scroll-to-bottom'
import "./Chat.css";

const socket = io.connect("https://realtime-chat-by-isaac.herokuapp.com/",{
  transports: ['websocket', 'polling', 'flashsocket'],
});

const Chat = () => {
  const { search } = useLocation();
  const [name, setName] = useState("");
  const [room, setRoom] = useState("");
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [onlineUser, setOnlineUser] = useState(0);

  useEffect(() => {
    const { name, room } = queryString.parse(search);
    setName(name);
    setRoom(room);
    socket.emit("join", { name, room } , ({error}) => {
      alert(error)
    });
    return () => {
      socket.emit("disconnect");
      socket.off();
    };
  }, [search]);

  
  const sendMessage = (e) => {
    e.preventDefault();
    const sendedData = {
      message,
      author: name,
      room: room,
    };
    if(message !== '') {
      socket.emit("sendMessage", sendedData, () => setMessage(""))
      setMessages([...messages,sendedData])
      setMessage('')
    }
  };

  socket.on('onlineUser',(data) => {
    setOnlineUser(data.onlineUser)
  })

  socket.on('message',(data)=>{
    setMessages([...messages, data]);
  })

  socket.on('disconnect',(data)=>{
    setMessages([...messages, data]);
  })

  socket.on("getData", (data) => {
    setMessages([...messages, data]);
  });



  return (
    <>
      <div className="chat-outer-container">
        <div className="chat-inner-container">
          <div className="chat-top">
            <div>
            <h2>{room} 's RoomChat.</h2>
            <p>{onlineUser} Users online</p>
            </div>
            <a href="/">
              <img src={close} alt="close"/>
            </a>
          </div>
            <ScrollToBottom  className="scroll">
              {messages?.map((message)=>(
                <div className={`text-container`} id={message.author === name ? 'you' : 'other'}>
                  <div className={`${message.author === 'admin' ? 'admin' : 'message-container'}`}>
                    <p>{ReactEmoji.emojify(message.message)}</p>
                  </div>
                  <div className="sender">
                    <p>{message.author}</p>
                  </div>
                </div>
              ))}
            </ScrollToBottom >
          <div className="chat-bottom">
            <input value={message} onChange={(e) => setMessage(e.target.value)} onKeyPress={(e)=> e.key === 'Enter' ? sendMessage(e) : null} className='chat-input'/>
            <button className='chat-button' onClick={sendMessage}>Send</button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Chat;
