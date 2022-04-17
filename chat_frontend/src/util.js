const baseUrl = `http://192.168.106.243:8000`;
const apiUrl = `${baseUrl}/api`;

const util = {
    checkUserUrl: apiUrl + '/checkUser/',

    scrollChatBox(){
        setTimeout(() => {
            let chatbox = document.getElementById("chat_container");
            chatbox.scrollTop = chatbox.scrollHeight;
          }, 200)
    },
}

export default util;