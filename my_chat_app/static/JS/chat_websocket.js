import util from './util.js'
import { friends_chat, username, app } from './home.js'

const chatSocket = new WebSocket(
    'ws://'
    + window.location.host
    + '/ws/chat/'
)




let receive_message = function(data){
    if (friends_chat.hasOwnProperty(app.chat_opened_user)){

        let _from = data['_from']
        let msg = data['message']
        let images = data['images'];
        
        let date = new Date();
        let c_time = date.getHours() + ":" + date.getMinutes();

        let chatBox = document.getElementById('chat_box');
        console.log(images);
        if (images){
            images = JSON.parse(images);
            for (let i = 1;i <= Object.keys(images).length;i++){
                chatBox.appendChild(util.getChatCardElement('03:12','receive', msg, images[i].image));
                friends_chat[_from].push(util.createChat({
                    'sender': _from,
                    'receiver': username,
                    'message': msg,
                    'receive_time': c_time,
                    'image': images[i].image,
                }));
                util.scrollToBottom(chatBox);
            }
        }else{
            chatBox.appendChild(util.getChatCardElement('03:12','receive', msg))
            friends_chat[_from].push(util.createChat({
                'sender': _from,
                'receiver': username,
                'message': msg,
                'receive_time': c_time,
            }));
            
            util.scrollToBottom(chatBox);
        }
    }
}

const commands = {
    'receive_message': receive_message,
}

chatSocket.onmessage = function(ev){
    const data = JSON.parse(ev.data);
    if (data.hasOwnProperty('command') && commands.hasOwnProperty(data['command']))
        commands[data['command']](data);
}

let send_msg = function(msg, receiver, saved_chat_ids_json=null){
    chatSocket.send(JSON.stringify({
        'command': 'send_message',
        'MESSAGE': msg,
        'RECEIVER': receiver,
        'IMAGES': saved_chat_ids_json,
    }))

    document.getElementById('msg_input').value = ''

    let chatBox = document.getElementById('chat_box');

    let date = new Date();
    let c_time = date.getHours() + ":" + date.getMinutes();

    let saved_chat_ids_obj = JSON.parse(saved_chat_ids_json);

    if (saved_chat_ids_obj){
        for (let i = 1;i <= Object.keys(saved_chat_ids_obj).length;i++){
            chatBox.appendChild(util.getChatCardElement(c_time, 'send', msg, saved_chat_ids_obj[i].image));
            
            friends_chat[username].push(util.createChat({
                'sender': username,
                'receiver': receiver,
                'message': msg,
                'receive_time': c_time,
                'image': saved_chat_ids_obj[i].image != "None" ? saved_chat_ids_obj[i].image : null,
            }));
            util.scrollToBottom(chatBox);
        }
    }else{
        chatBox.appendChild(util.getChatCardElement(c_time, 'send', msg));
        friends_chat[username].push(util.createChat({
            'sender': username,
            'receiver': receiver,
            'message': msg,
            'receive_time': c_time,
        }));
        util.scrollToBottom(chatBox);
    }

};

let sendMessage = function(){

    let msg = document.getElementById('msg_input').value;
    let receiver = app.chat_opened_user;

    if (app.images_selected){
        app.images_selected = false;

        let url = 'uploadChatImages/';
    
        let htmlForm = document.getElementById('send_image_form');
    
        let formData = new FormData(htmlForm);
        formData.append('RECEIVER', receiver);
        formData.append('MESSAGE', msg);
    
        fetch(url, {
            method:'POST',
            headers:{
                'Accept': 'text/json',
                'X-CSRFToken': util.getCookie('csrftoken'),
            },
            body: formData
        
        }).then(res => res.json()).then(res => {
            send_msg(msg, receiver, JSON.stringify(res));
        })
        .catch(err => {
            console.log("something is wrong in sendmessage " + String(err));
        })

    
    }else if (String(msg).trim().length > 0){
        send_msg(msg, receiver);
    }
  
};
window.sendMessage = sendMessage;