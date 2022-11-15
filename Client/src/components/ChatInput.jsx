import React from 'react'
import {useState} from 'react'

function ChatInput() {
    const [textArea,setTextArea] = useState(null)
    
  return (
    <div className='chat-input'>
        <textarea value={textArea} onChange={(e)=>setTextArea(e.target.value)}/>
        <button className='secondary-button'>Submit</button>
    </div>
  )
}

export default ChatInput

// Be careful bc I has to change the value x