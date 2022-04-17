import './style.css';
import util from './util.js';
import ChatReceived from './components/chatReceived';
import ChatSent from './components/chatSent';
import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { sendMessage, setChatSocket } from './chat_socket.js';

function App() {

  const [user_opened, setUserOpened] = useState("");
  const [msg, setMsg] = useState("");

  const [chats, setChats] = useState([]);

  const { username } = useLocation().state;

  let chatSocket;

  chatSocket = setChatSocket(username);

  chatSocket.onmessage = function(ev){
    const data = JSON.parse(ev.data);
    setChats([...chats, <ChatReceived msg={data.message} key={chats.length}/>])
    util.scrollChatBox();
  }

  const fetchAllChats = function(){
    
  }

  return (
    <div className="App">
      <div className='left'> 
        <div style={{height: '10%'}} className='bd profile'></div>
        <hr></hr>
        <div style={{height: '10%'}} className='bd search_bar flex-all'>
          <input className='search_chat_input' placeholder='Search New Chat'></input>
          <img src='/send_msg.png' width="40px" onClick={() => {
            let username = document.querySelector('.search_chat_input').value;

            fetch(util.checkUserUrl, {
              method: "POST",
              body: JSON.stringify({ 'username': username }),
              mode: 'cors',
              headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
              }
            }).then(res => res.json()).then(res => {
              if (res.found){
                setUserOpened(username);
              }
            }).catch(err => {
              console.log(err);
            })

          }}></img>
        </div>
        <hr></hr>
        <div style={{height: '79%'}} className='bd chat_list'>
        </div>
      </div>
      <div className='right'>
        <div className='chat_box'>
          <div className='chat_head bd' style={{height: '10%', display: 'flex', alignItems: 'center'}}>
            <img src='/gagan.jpg' style={{borderRadius: '100%',height: '90%', width: '60px', marginLeft: '5px'}}></img>
            <p style={{marginLeft: '20px', fontSize: '20px'}}>{ user_opened }</p>
          </div>
          <hr></hr>
          <div id='chat_container' className='chat_container bd'style={{height: '79%'}}>
            {chats}
          </div>
          <hr></hr>
          <div className='chat_bottom bd flex-all' style={{height: '10%'}}>
            <input placeholder='Type a message' onChange={(e) => {
              setMsg(e.target.value);
            }} onKeyUp={(e) => {
              if (e.key === 'Enter' || e.keyCode === 13){
                document.getElementById("send_msg_btn").click();
              }
            }} value={msg} className='message_input'></input>
            <img 
            src='/send_msg.png' 
            id='send_msg_btn'
            onClick={() => {
              // send message to server (to send it to receiver)
              sendMessage(msg, user_opened);
              setChats([...chats, <ChatSent msg={msg} key={chats.length} />])
              util.scrollChatBox();
              setMsg("");
            }} 
            width={"40px"} 
            style={{margin: '0px 10px'}}></img>

          </div>
        </div>
      </div>
    </div>
  );
}



export default App;
