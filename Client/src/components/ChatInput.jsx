import React from 'react'
import {useState} from 'react'

function ChatInput() {
    const [textArea,setTextArea] = useState(null)
    const x = ""
  return (
    <div className='chat-input'>
        <textarea value={x} onChange={(e)=>setTextArea(e.target.value)}/>
        <button className='secondary-button'>Submit</button>
    </div>
  )
}

export default ChatInput

// Be careful bc I has to change the value x