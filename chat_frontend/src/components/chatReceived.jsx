import ChatMediaCard from "./chat_media_card";

function ChatReceived({msg,file}){
    return (
        <div className='chat_card_cover bd' style={{width: '100%'}}>
              <div className='chat_card chat_received'>
                {file ? <ChatMediaCard file={file}/> : ""}
                <span>{ msg }</span>
              </div>
        </div>
    )
}

export default ChatReceived;