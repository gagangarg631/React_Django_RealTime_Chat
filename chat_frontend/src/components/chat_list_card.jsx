function ChatListCard(props){

    return (
        <div className='card' onClick={() => {
            props.tapped(props.username)
        }}>
            <input type="hidden" name={props.username} />
            <img src='/avtar.png' style={{borderRadius: '100%',height: '90%', width: '60px', marginLeft: '5px'}}></img>
            <p style={{marginLeft: '20px', fontSize: '20px'}}>{ props.username }</p>
        </div>
    )
}

export default ChatListCard;