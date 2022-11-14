import util from "../util";

function ChatMediaCard({file}) {
    let type = file.type.slice(0,file.type.indexOf('/'));

    let content = ``;
    if (type == "image"){

        content = <img style={{width: '210px'}} src={ (file.url.slice(0,4) == "data" ? "" : util.mediaUrl) + file.url }></img>
    }else if (type == "application"){
        content = <div>This is file</div>
    }

    return (
        <div style={{backgroundColor: 'white'}}>
            {content}
        </div>
    )
}

export default ChatMediaCard;