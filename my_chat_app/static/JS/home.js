import util from './util.js'

export let username = document.getElementById('username').value;

export let app = {
    images_selected : false,
    chat_opened_user: null,
    back_states: [],
    current_state: null,
}

export const friends_chat = {};

friends_chat[username] = [];
app.current_state = 'friends_list';

let showChats = function(friend_username){
    let chatBox = document.getElementById('chat_box');
    chatBox.innerHTML = '';
    
    friends_chat[friend_username].forEach(obj => {
        if (obj.sender == username){
            chatBox.appendChild(util.getChatCardElement(obj.send_time,'send', obj.message, obj.image))
        }else{
            chatBox.appendChild(util.getChatCardElement(obj.sender == username ? obj.send_time : obj.receive_time,'receive', obj.message, obj.image))
        }
    })
}

let openChat = function(){
    
    
    
    
    let open_chat = document.getElementById('friend_chat_open');

    open_chat.style.setProperty('visibility', 'visible');

    let card_username = this.querySelector('#card_username').value;
    app.chat_opened_user = card_username;

    let profile_name_el = document.getElementById('opened-chat-profile_name');
    profile_name_el.innerHTML = `<p>${app.chat_opened_user}</p>`
    
    setTimeout(() => {
        util.scrollToBottom(document.getElementById('chat_box'));
    },200)

    if (screen.width > 500) {

    }else{
        app.back_states.push(app.current_state);
        app.current_state = 'friend_chat_open';

        open_chat.style.width = '100%';

        let friend_list = document.getElementById('friends_list');
        friend_list.style.width = '0%';
        friend_list.style.visibility = 'hidden';

    }   

    if (! friends_chat.hasOwnProperty(card_username)){

        let url = `getChats/10/${card_username}`;
        friends_chat[card_username] = [];
    
        fetch(url, {
            method:'GET',
            headers:{
                'Content-Type': 'text/json',
                'X-CSRFToken': util.getCookie('csrftoken'),
            },
        }).then(res => res.json()).then(res => {
            for (let i = 1;i <= Object.keys(res).length;i++){

                let obj = res[i];
                friends_chat[card_username].push(obj);
            }
            showChats(card_username);
        }).catch(err => {
            console.log("ERROR in fetch: " + String(err));
        })
    }else{
        showChats(card_username);
    }

    document.getElementById('msg_input').addEventListener('keyup', function(ev){
        if (ev.key == 'Enter'){
            document.getElementById('msg_send_button').click();
        }
    })
}
window.openChat = openChat;

let showNotifications = function(){
    let panel = document.getElementById('notification_open');
    panel.style.visibility == 'hidden' ? panel.style.visibility = 'visible' : panel.style.visibility = 'hidden';

    
}
window.showNotifications = showNotifications;

let oneStepBack = function(){

}
window.oneStepBack = oneStepBack;

let filesInputChanged = function(ev){
    if (this.files.length > 0){
        app.images_selected = true;
    }else{
        app.images_selected = true;
    }
}
window.filesInputChanged = filesInputChanged;

window.addEventListener('click', function(ev){
    if (! ev.target.closest('.friend_card') && (! ev.target.closest('#friend_chat_open'))){
        let open_chat = document.getElementById('friend_chat_open');
        open_chat.style.setProperty('visibility', 'hidden');
    }
})



