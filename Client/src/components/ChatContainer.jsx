import React from 'react'
import ChatHeader from './ChatHeader'
import MatchesDisplay from './MatchesDisplay'
import ChatDisplay from './ChatDisplay'



function ChatContainer() {
  return (
    <div className="chat-container">

      <ChatHeader/>

    <button className='option'>matches</button>
    <button className='option'>chat</button>
    <MatchesDisplay/>

    <ChatDisplay/>
    </div>
  )
}

export default ChatContainer