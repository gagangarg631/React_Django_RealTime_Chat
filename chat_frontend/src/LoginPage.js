import { Link } from "react-router-dom";
import { useState } from "react";

function LoginPage(){

    const [username, setUsername] = useState("");

    return (
        <div>
            <p>Login Page</p>
            <input value={username} onChange={(ev) => {
                setUsername(ev.target.value);
            }}></input>
            <Link to="/app" state={{'username': username}}>Login</Link>
        </div>
    )
}

export default LoginPage;