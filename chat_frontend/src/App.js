import './style.css';
import { checkUserUrl } from "./util.js"
import ChatListCard from './components/chat_list_card';

function App() {

  const getFriends = function(){
    
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

            fetch(checkUserUrl, {
              method: "POST",
              body: JSON.stringify({ 'username': username }),
              mode: 'cors',
              headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
              }
            }).then(res => res.json()).then(res => {
              console.log(res);
            }).catch(err => {
              console.log(err);
            })

          }}></img>
        </div>
        <hr></hr>
        <div style={{height: '79%'}} className='bd chat_list'>
          {
            
          }
        </div>
      </div>
      <div className='right'>
        <div className='chat_box'>
          <div className='chat_head bd' style={{height: '10%', display: 'flex', alignItems: 'center'}}>
            <img src='/gagan.jpg' style={{borderRadius: '100%',height: '90%', width: '60px', marginLeft: '5px'}}></img>
            <p style={{marginLeft: '20px', fontSize: '20px'}}>Mr. Hacker</p>
          </div>
          <hr></hr>
          <div className='chat_container bd'style={{height: '79%'}}>
            <div className='chat_card_cover bd' style={{width: '100%'}}>
              <div className='chat_card chat_sent'>
                <span>myself gagan garg and i am a backend developer.</span>
              </div>
            </div>
            <div className='chat_card_cover bd' style={{width: '100%'}}>
              <div className='chat_card chat_received'>
                <span>myself gagan garg and i am a backend developer
                  its my strategy to develop all my skillset.</span>
              </div>
            </div>
          </div>
          <hr></hr>
          <div className='chat_bottom bd flex-all' style={{height: '10%'}}>
            <input placeholder='Type a message' className='message_input'></input>
            <img src='/send_msg.png' width={"40px"} style={{margin: '0px 10px'}}></img>
          </div>
        </div>
      </div>
    </div>
  );
}



export default App;
