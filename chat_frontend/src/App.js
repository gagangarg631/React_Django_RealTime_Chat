import './style.css';
import util from './util.js';
import ChatListCard from './components/chat_list_card';
import ChatReceived from './components/chatReceived';
import ChatSent from './components/chatSent';
import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { sendMessage, setChatSocket } from './chat_socket.js';

function App() {

  const [user_opened, setUserOpened] = useState("");
  const [msg, setMsg] = useState("");

  const [chats, setChats] = useState([]);
  const [friends, setFriends] = useState([]);

  const { username } = useLocation().state;

  let chatSocket;

  chatSocket = setChatSocket(username);

  chatSocket.onmessage = function(ev){
    const data = JSON.parse(ev.data);
    setChats([...chats, <ChatReceived msg={data.message} key={chats.length}/>])
    util.scrollChatBox();
  }

  const fetchAllChats = async function(){
    let friends = await util.fetchData(util.getFriendsUrl, username);
    let f_list = friends.map((obj, index) => <ChatListCard tapped={openChat} username={obj.username} key={index} />);
    setFriends(f_list);
  }

  const openChat = async function(fr_username){
    let data = await util.fetchData(util.checkUserUrl, fr_username);
    if (data.found){
      setUserOpened(fr_username)
      let prev_chats = await util.fetchData(util.getChatsUrl, username, fr_username);
      let l_list = prev_chats.map((obj, index) => {
        if (obj.sender === username){
          return <ChatSent msg={obj.message} key={index} />
        }else{
          return <ChatReceived msg={obj.message} key={index} />
        }
      })
      setChats(l_list);
    }else{
      alert("User Not Found!");
    }
  }

  useEffect(() => {
    fetchAllChats();
  }, []);

  return (
    <div className="App">
      <div className='left'> 
        <div style={{height: '10%'}} className='bd profile flex-all'>
          <p style={{fontSize: '20px', fontWeight: 'bold', color: 'green'}}>{ username }</p>
        </div>
        <hr></hr>
        <div style={{height: '10%'}} className='bd search_bar flex-all'>
          <input className='search_chat_input' placeholder='Search New Chat'
            onKeyUp={(e) => {
            if (e.key === 'Enter' || e.keyCode === 13){
              document.getElementById("search_chat_btn").click();
            }

          }}></input>
          <img src='/send_msg.png' id='search_chat_btn' width="40px" onClick={async () => {
            let fr_username = document.querySelector('.search_chat_input').value;
            openChat(fr_username);
            setFriends([...friends, <ChatListCard tapped={openChat} username={fr_username} key={friends.length} />])
          }}></img>
        </div>
        <hr></hr>
        <div style={{height: '79%'}} className='bd chat_list'>
          {friends}
        </div>
      </div>
      <div className='right'>
        <div className='chat_box'>
          <div className='chat_head bd' style={{height: '10%', display: 'flex', alignItems: 'center'}}>
            <img src='/avtar.png' style={{borderRadius: '100%',height: '90%', width: '60px', marginLeft: '5px'}}></img>
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
