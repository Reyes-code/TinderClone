import React from 'react'
import {useState} from 'react'

const AuthModal=({setShowModal, isSignUp})=> {

    const[email,setEmail] = useState(null)
    const[password] = useState(null)
    const[confirmPassword] = useState(null)
    const[error,setError] = useState(null)

    console.log(email,password,confirmPassword)
    
    const handleClick = () =>{
        setShowModal(false)
    }

    const handleSubmit =(e)=>{
        e.preventDefault();
        try{
            if( isSignUp && (password!==confirmPassword)){
                setError("Passwords need to match!")
            }
            console.log('make a post request to our database')
        }catch(error){
            console.log(error)
        }
    }


    return (
        <div className="auth-modal">
            <div className= "close-icon" onClick={handleClick}>Ⓧ</div>
            <h2>{isSignUp? 'Create Account': 'Log In'}</h2>
            <p>By clicking In, you agree to our terms, Learn how we process your data in our Privacy Policiy</p>

            <form onSubmit={handleSubmit}>
                <input
                    type="email" 
                    id ="email"
                    name = "email" 
                    placeholder="Email"
                    required = {true}  
                    onChange={(e)=> setEmail(e.target.value)}         
                />
                 <input
                    type="password" 
                    id ="password"
                    name = "password"
                    placeholder="Password"  
                    required = {true}  
                    onChange={(e)=> setEmail(e.target.value)}         
                />
                {isSignUp &&<input
                    type="password" 
                    id ="password-check"
                    name = "password-check"
                    placeholder="Confirm password"  
                    required = {true}  
                    onChange={(e)=> setEmail(e.target.value)}         
                />}
                <input className="secondary-button" type="submit"/>
                <p>{error}</p>
            </form>
            <hr/>
            <h2>GET THE APP</h2>
            AuthModal
        </div>
  )
}

export default AuthModal