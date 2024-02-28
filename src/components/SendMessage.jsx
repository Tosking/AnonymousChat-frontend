import React, { useState, useEffect, useContext } from 'react'
import { ConnectionContext } from './ConnectionContext';

function SendMessage() {
    const [messageInput, setMessageInput] = useState('');

    const connection = useContext(ConnectionContext)
    const sendMessage = async () => {
        try {
            const chatroom = JSON.parse(localStorage.getItem('chatroom'))
            if(!messageInput || !chatroom) return
            await connection.send('SendMessage', localStorage.getItem('token'), chatroom.id, messageInput);
            setMessageInput('');
        } catch (error) {
            console.error('Error sending message:', error);
        }
    };
    return (
        <ul>
            <input type="text" value={messageInput} onChange={e => setMessageInput(e.target.value)} placeholder='Message'/>
            <button onClick={sendMessage}>Send</button>
        </ul>
    )
}

export default SendMessage