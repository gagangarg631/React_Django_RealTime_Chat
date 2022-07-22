const ip = '192.168.29.246:8000';
const baseUrl = `http://${ip}`;
const apiUrl = `${baseUrl}/api`;

export const username = "";

const util = {
    ip: ip,
    checkUserUrl: apiUrl + '/checkUser/',
    getFriendsUrl: apiUrl + '/getFriends/',
    createUserUrl: apiUrl + '/createUser/',
    getChatsUrl: apiUrl + '/getChats/',

    scrollChatBox(){
        setTimeout(() => {
            let chatbox = document.getElementById("chat_container");
            chatbox.scrollTop = chatbox.scrollHeight;
          }, 200)
    },

    async fetchData(url, username, friend_username=null){
        try{
            let result = await fetch(url, {
                method: 'POST',
                body: JSON.stringify({ 'username': username, 'friend_username': friend_username }),
                mode: 'cors',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            })

            if (result.ok == true && result.status == 200){
                let data = await result.json();
                return data;
            }

        }catch(err){
            console.log(err);
        }
    
    }
}

export default util;
