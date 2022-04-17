let chatSocket;

export const setChatSocket = function(username){
    chatSocket = new WebSocket(
        'ws://'
        + '192.168.106.243:8000'
        + '/ws/chat/'
        +  username
    )

    return chatSocket;
}

const receive_message = function(data){
    console.log(data);
}

const commands = {
    'receive_message': receive_message,
}

export const sendMessage = function(msg, receiver, saved_chat_ids_json=null){
    chatSocket.send(JSON.stringify({
        'command': 'send_message',
        'MESSAGE': msg,
        'RECEIVER': receiver,
        'IMAGES': saved_chat_ids_json,
    }))


}