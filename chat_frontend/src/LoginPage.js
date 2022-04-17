import { Link } from "react-router-dom";
import { useState } from "react";
import util from "./util";

function LoginPage(){

    const [username, setUsername] = useState("");

    return (
        <div>
            <p>Login Page</p>
            <input value={username} onChange={(ev) => {
                setUsername(ev.target.value);
            }}></input>
            <button onClick={async () => {
                let result = await util.fetchData(util.createUserUrl, username);
                if (result.status === 'success'){
                    document.getElementById("login_link").click()   ;
                }else{
                    alert("Something went wrong!");
                }
            }}>Login</button>
            <Link to="/app" id="login_link" state={{'username': username}}></Link>
        </div>
    )
}

export default LoginPage;