import axios from "axios";
import { SyntheticEvent, useState } from "react"
import { UserErrors } from "../../errors";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";

export const AuthPage=() => {
    return  (
           <div className="auth">
           <Register/>
           <Login/>
           </div>
     )
}

const Register=() => {
    const [username,setUsername]=useState<string>("");
    const [password,setPassword]=useState<string>("");
    const handleSubmit=async (event : SyntheticEvent) => {
        event.preventDefault();
        try{
        await axios.post('http://localhost:3000/user/register',{username,password});// request Body
        alert("User Registered Successfully")
        }catch(error){
            if(error?.response?.data?.type===UserErrors.USERNAME_ALREADY_EXISTS){
                alert("ERROR : Username already in Use")
            }else{
                alert("ERROR : Something went Wrong")
            }
        }
    }


    return (
        <div className="auth-container">
            <form onSubmit={handleSubmit}>
              <h2>Register</h2>
              <div className="form-group">
                 <label htmlFor="username">Username : </label>
                 <input type="text" 
                  id="username" 
                  value={username}
                  onChange={(event) => setUsername(event.target.value)} />
              </div>
              <div className="form-group">
                 <label htmlFor="password">Password : </label>
                 <input type="password" 
                        id="password" 
                        value={password}
                        onChange={(event) => setPassword(event.target.value)} />
              </div>
              <button type="submit">Register</button>
            </form>
        </div>
    )
}

const Login=() => {
    const [username,setUsername]=useState<string>("");
    const [password,setPassword]=useState<string>("");
    const [_,setCookies]=useCookies(["access-token"]);
    const navigate=useNavigate();
    
    const handleSubmit=async (event : SyntheticEvent) => {
        event.preventDefault();
        try{
        const result=await axios.post('http://localhost:3000/user/login',{username,password});// request Body
        setCookies("access-token",result.data.token);
        localStorage.setItem("userID",result.data.userID);
        navigate("/")
        }catch(error){
            let errorMessage : string=""
            switch(error.response.data.type){
                case UserErrors.NO_USER_FOUND :
                    errorMessage="User doesn't Exists"
                    break;
                case UserErrors.WRONG_CREDENTIALS :
                    errorMessage="Wrong Username/Password combination"
                    break;
                default :
                    errorMessage="Something Went Wrong"
            }

           alert("Error :" + errorMessage);
        }
    }


    return (
        <div className="auth-container">
            <form onSubmit={handleSubmit}>
              <h2>Login</h2>
              <div className="form-group">
                 <label htmlFor="username">Username : </label>
                 <input type="text" 
                  id="username" 
                  value={username}
                  onChange={(event) => setUsername(event.target.value)} />
              </div>
              <div className="form-group">
                 <label htmlFor="password">Password : </label>
                 <input type="password" 
                        id="password" 
                        value={password}
                        onChange={(event) => setPassword(event.target.value)} />
              </div>
              <button type="submit">Login</button>
            </form>
        </div>
    )
}
