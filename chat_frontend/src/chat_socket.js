let chatSocket;

export const setChatSocket = function(username, ip){
    chatSocket = new WebSocket(
        'ws://'
        + ip
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

export const sendMessage = function(msg, file, receiver){
    chatSocket.send(JSON.stringify({
        'command': 'send_message',
        'MESSAGE': msg,
        'RECEIVER': receiver,
        'FILE': file,
    }))


}