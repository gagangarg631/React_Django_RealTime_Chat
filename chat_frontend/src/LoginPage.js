import { Link } from "react-router-dom";
import { useState } from "react";
import util from "./util";

function LoginPage(){

    const [username, setUsername] = useState("");

    return (
        <div className="login_page">
            <img id="logo" src="s_logo.png"></img>
            <div className="login_box">

                <p style={{paddingLeft: '20px', fontSize: '25px'}}><strong>Login</strong></p>


                <input placeholder="Enter Username" className="login_input" value={username} onChange={(ev) => {
                    setUsername(ev.target.value);
                }} onKeyUp={(e) => {
                    if (e.key === 'Enter' || e.keyCode === 13){
                    document.getElementById("login_btn").click();
                    }
                }}></input>

                <button id="login_btn" className="login_btn" onClick={async () => {
                    let result = await util.fetchData(util.createUserUrl, username);
                    if (result.status === 'success'){
                        document.getElementById("login_link").click()   ;
                    }else{
                        alert("Something went wrong!");
                    }
                }}>Login</button>
                <Link to="/app" id="login_link" state={{'username': username}}></Link>
            </div>
        </div>
    )
}

export default LoginPage;