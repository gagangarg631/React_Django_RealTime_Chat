const baseUrl = `http://192.168.106.243:8000`;
const apiUrl = `${baseUrl}/api`;

export const username = "";

const util = {
    checkUserUrl: apiUrl + '/checkUser/',
    getFriendsUrl: apiUrl + '/getFriends/',

    scrollChatBox(){
        setTimeout(() => {
            let chatbox = document.getElementById("chat_container");
            chatbox.scrollTop = chatbox.scrollHeight;
          }, 200)
    },

    async fetchData(url, username){
        try{
            let result = await fetch(url, {
                method: 'POST',
                body: JSON.stringify({ 'username': username }),
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