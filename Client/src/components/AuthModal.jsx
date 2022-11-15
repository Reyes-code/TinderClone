import React from 'react'
import {useState} from 'react'
import axios from 'axios'
import {useNavigate} from 'react-router-dom'

const AuthModal=({setShowModal, isSignUp})=> {

    const[email,setEmail] = useState(null)
    const [password, setPassword] = useState(null)
    const [confirmPassword, setConfirmPassword] = useState(null)
    const [error, setError] = useState(null)

    let navigate = useNavigate()

    console.log(email,password,confirmPassword)
    
    const handleClick = () =>{
        setShowModal(false)
    }

    const handleSubmit = async(e)=>{
        e.preventDefault();
        try{
            if( isSignUp && (password!==confirmPassword)){
                setError("Passwords need to match!")
                return
            }
            
            console.log('posting',email,password)

            const response = await axios.post('http://localhost:8000/signup', {email,password})

            const succes = response.status === 201

            if (succes) navigate ('/onboarding')
            
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
                    onChange={(e)=> setConfirmPassword(e.target.value)}         
                />
                {isSignUp &&<input
                    type="password" 
                    id ="password-check"
                    name = "password-check"
                    placeholder="Confirm password"  
                    required = {true}  
                    onChange={(e)=> setPassword(e.target.value)}         
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