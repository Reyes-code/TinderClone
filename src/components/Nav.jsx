import React from 'react'
import logo from '../images/tinder_logo_white.png'
import colorLogo from "../images/color-logo-tinder.png"

const Nav = ({minimal, authToken, setShowModal, showModal, setIsSignUp})=> {

  const handleClick = () => {
    console.log("Clicked") 
    setShowModal(true) 
    setIsSignUp(false)
  } 

  return (
    <nav>
      <div className="logo-container">
        <img className ="logo" src={minimal ? colorLogo : logo}/>
      </div>
      {!authToken && !minimal && <button 
      className = "nav-button"
      onClick={handleClick}
      disabled={showModal}
      >Login</button>}
    </nav>
  )
}

export default Nav