function ChatReceived(props){
    return (
        <div className='chat_card_cover bd' style={{width: '100%'}}>
              <div className='chat_card chat_received'>
                <span>{ props.msg }</span>
              </div>
        </div>
    )
}

export default ChatReceived;