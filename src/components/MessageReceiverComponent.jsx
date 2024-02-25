import React, { useState, useEffect } from 'react';
import * as signalR from '@microsoft/signalr';

const ChatComponent = () => {
    const [connection, setConnection] = useState(null);
    const [messages, setMessages] = useState([]);
    const [messageInput, setMessageInput] = useState('');
    const [chatRoomName, setChatRoomName] = useState(null);

    useEffect(() => {
        const newConnection = new signalR.HubConnectionBuilder()
            .withUrl('http://localhost:5075/chatHub')
            .withAutomaticReconnect()
            .build();

        setConnection(newConnection);

        newConnection.start()
            .then(() => console.log('Connection established.'))
            .catch(error => console.error('Error establishing connection:', error));

        newConnection.on('ReceiveMessage', (user, message) => {
            setMessages(prevMessages => [...prevMessages, { user, message }]);
        });

    }, []);


    const sendMessage = async () => {
        try {
            if(!messageInput || !chatRoom) return
            await connection.send('CreateChatroom', chatRoomName);
            setChatRoomName('');
        } catch (error) {
            console.error('Error creating chatroom:', error);
        }
    };

    const createChatroom = async () => {
        try {
            await connection.send('SendMessage', 'User', messageInput);
            setMessageInput('');
        } catch (error) {
            console.error('Error sending message:', error);
        }
    };

    return (
        <div>
            <ul>
                {messages.map((msg, index) => (
                    <li key={index}>{msg.user}: {msg.message}</li>
                ))}
            </ul>
            <ul>
                <input type="text" value={messageInput} onChange={e => setMessageInput(e.target.value)} placeholder='Message'/>
                <button onClick={sendMessage}>Send</button>
            </ul>
            <ul>
                <input type="text" value={chatRoomName} onChange={e => setChatRoomName(e.target.value)} placeholder='Chatroom name'/>
                <button onClick={setChatRoomName}>Create</button>
            </ul>
        </div>
    );
};

export default ChatComponent;