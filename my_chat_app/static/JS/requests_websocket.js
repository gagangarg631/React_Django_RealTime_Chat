import util from './util.js'

let notification_bell = document.getElementById('notification_open');


const skt = new WebSocket(
    'ws://'
    + window.location.host
    + '/ws/requsets/'
)

let receive_request = function(data){
    let _from = data['_from']
    let message = data['message']
    notification_bell.appendChild(util.getRequestCardElement(_from,message));
}

let request_accepted = function(data){
    let _by = data['_by']
    let message = data['message']
    notification_bell.appendChild(util.getRequestAcceptedCardElement(message));
}

let incoming_notifications = function(data){
    let requests_messages = Array.from(data['incoming_requests_messages'])
    let requests_from = Array.from(data['incoming_requests_from'])
    for (let i = 0;i < requests_messages.length;i++){

        notification_bell.appendChild(util.getRequestCardElement(requests_from[i],requests_messages[i]))
    }
}

const commands = {
    'receive_request': receive_request,
    'request_accepted': request_accepted,
    'incoming_notifications': incoming_notifications,
}

skt.onmessage = function(ev){
    const data = JSON.parse(ev.data);
    if (data.hasOwnProperty('command') && commands.hasOwnProperty(data['command']))
        commands[data['command']](data);

}

let sendRequest = function(){
    let to_usr = document.getElementById('user_to_req').value;
    skt.send(JSON.stringify({
        'command': 'send_request',
        'DEST_USER': String(to_usr)
    }))
    document.getElementById('user_to_req').value = '';
}
window.sendRequest = sendRequest;


let handle_request = function(req_from){
    if (this.value == 'Accept'){
        skt.send(JSON.stringify({
            'command': 'accept_request',
            'SENDER': req_from
        }))
    }else if (this.value == 'Delete'){
        // skt.send(JSON.stringify({
        //     'requested_by': String(req_from),
        //     'deleted_by': String(user)
        // }))
    }
    this.closest('.request_card').remove();
}
window.handle_request = handle_request;

