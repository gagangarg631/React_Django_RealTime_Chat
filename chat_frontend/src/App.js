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

  const [search, setSearch] = useState("");

  let chatSocket;

  chatSocket = setChatSocket(username, util.ip);

  chatSocket.onmessage = function(ev){
    const data = JSON.parse(ev.data);

    let fr = document.querySelector(`.card input[name="${data._from}"]`);
    
    if (fr){

    }else{
      setFriends([...friends, <ChatListCard tapped={openChat} username={data._from} key={friends.length} />])
    }
    util.scrollChatBox();
  }

  const fetchAllChats = async function(){
    let friends = await util.fetchData(util.getFriendsUrl, username);
    let f_list = friends.map((obj, index) => <ChatListCard tapped={openChat} username={obj.username} key={index} />);
    setFriends(f_list);
  }

  const openChat = async function(fr_username){

    if (window.screen.width <= 500){
      document.querySelector(".App .left").style.display = 'none';
      document.querySelector(".App .right").style.display = 'initial';

    }
    
    let data = await util.fetchData(util.checkUserUrl, fr_username);
    
    if (data.found){
      
      setFriends([...friends, <ChatListCard tapped={openChat} username={fr_username} key={friends.length} />])
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
        <div className='bd search_bar flex-all'>
          <input className='search_chat_input' placeholder='Search New Chat' value={search}
            onKeyUp={(e) => {
            if (e.key === 'Enter' || e.keyCode === 13){
              document.getElementById("search_chat_btn").click();
            }

          }} onChange={
            (e) => {
              setSearch(e.target.value);
            }
          }></input>
          <img src='/send_msg.png' id='search_chat_btn' style={{margin: '0 5px'}} width="35px" onClick={async () => {
            let fr_username = search;
            setSearch("");
            openChat(fr_username);
          }}></img>
        </div>
        <div style={{height: '79%'}} className='bd chat_list'>
          {friends}
        </div>
      </div>
      <div className='right'>
        <div className='chat_box'>
          <div className='chat_head bd'>
            <img src='/avtar.png'></img>
            <p style={{marginLeft: '20px', fontSize: '20px'}}>{ user_opened }</p>
          </div>
          <div className='chat_container_cover' style={{height: '79%'}}>
            <div id='chat_container' className='chat_container bd'style={{height: '100%'}}>
              {chats}
            </div>
          </div>
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
            width={"35px"} 
            style={{margin: '0px 10px'}}></img>

          </div>
        </div>
      </div>
    </div>
  );
}



export default App;
