let util = {
    
    msg_request_from: 'MESSAGE_REQUEST',
    to_user: 'DEST_USER',
    source_room: 'SOURCE_ROOM_NAME',

    sender: 'SENDER',
    receiver: 'RECEIVER',
    msg: 'MESSAGE',

    createChat({
        sender,receiver,message,send_time,receive_time, image
    }){
        return {
            'sender': sender,
            'receiver': receiver,
            'message': message,
            'send_time': send_time,
            'receive_time': receive_time,
            'image': image,
        }
    },

    htmlToElement(html){
        let temp = document.createElement('div');
        temp.insertAdjacentHTML('beforeend', html);
        return temp.firstElementChild;
    },

    getChatCardElement(time,type,message=null,image_url=null){
        const chat_card_html = 
        `
        <div class="chat-card bd m1 msg_${type}${image_url ? '_image' : '_text'}" style="font-weight: bold;display:flex;align-item:flex-end;justify-content:center;flex-direction:column;border-radius: 20px;overflow: hidden;">
            

            <div class="msg m0" style="display: flex;justify-content: flex-end;font-size:15px;width: 96%;">
                <p>${message}</p>
            </div>
            <div class="time m0" style="display: flex;justify-content: flex-end;font-size:12px;width: 96%;">
                <p>${time}</p>
            </div>
        </div>
        `;

        let el = util.htmlToElement(chat_card_html);

        if (image_url){
            el.insertAdjacentHTML('afterbegin', `<div class="image" style="width: 100%;height: 200px;">
            <img src="${image_url}" width="100%" height="100%" alt="">
        </div>`)
        }

        return el;
    },

    getRequestCardElement(req_from,message){
        const request_card_html = `
        <div class="request_card flex-all gbd m0" style="border-radius: 20px;height: 75px;background-color:white;">
                <input type="hidden" id="card_username" value="{{ item.username }}">
                <div class="user-card-pic wh-wrap" style="height: 100%;">   
                    <img src="{% static 'Images/g3.jpg' %}" style="height: 100%;border-radius: 50%;" alt="N">
                </div>
                <div style="width: 70%;margin: 5px;height: 80%;">
                    <div class="user-card-username rbd" style="width: 70%;height: 40%;margin: 3px;">
                        <p class="friend-card-username">${req_from}</p>   
                    </div>
                    <div class="btns rbd" style="height: 50%;margin: 3px;">
                        <input style="width:48%;" onclick="handle_request.bind(this)('${req_from}')" type="button" class="btn btn-primary btn-sm" onclick="handle_request.bind(this)('${req_from}')" value="Accept">
                        <input style="width:48%;" onclick="handle_request.bind(this)('${req_from}')" type="button" class="btn btn-secondary btn-sm" onclick="handle_request.bind(this)('${req_from}')" value="Delete">
                    </div>
                </div>    
            </div>
            <hr>

        <div class="request_card gbd wh-wrap m1">
        <p>${message}</p>
        <input type="button" onclick="handle_request.bind(this)('${req_from}')" value="Accept">
        <input type="button" onclick="handle_request.bind(this)('${req_from}')" value="Delete">
        </div>`;
    
        return util.htmlToElement(request_card_html);
    },
    
    getRequestAcceptedCardElement(message){
        const request_accpted_html = `
            <p>${message}<p>
        `
        return util.htmlToElement(request_accpted_html);
    },
    
    getCookie(_key){
        let cookies = document.cookie.split(';');
        for (let i = 0;i < cookies.length; i++){
            let ck = cookies[i];
    
            if (ck.substring(0, ck.indexOf('=')).trim() == _key){
                return ck.slice(ck.indexOf('=') + 1);
            }
        }
    },

    scrollToBottom(el){
        el.scrollTop = el.scrollHeight;
    },
    
}

export default util;