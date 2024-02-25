import React, { useState, useEffect } from 'react';
import * as signalR from '@microsoft/signalr';
import CreateUser from './CreateUser';
import CreateChatroom from './CreateChatroom';
import SendMessage from './SendMessage';

const ChatComponent = () => {
    const [connection, setConnection] = useState(null);
    const [messages, setMessages] = useState([]);
    const [username, setUsername] = useState('');
    const [chatroom, setChatroom] = useState('');

    useEffect(() => {
        setUsername(localStorage.getItem('name'))
        setChatroom(localStorage.getItem('chatroom'))

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

        newConnection.on('CreateUser', (name, userId, token) => {
            localStorage.setItem('name', name)
            localStorage.setItem('userId', userId)
            localStorage.setItem('token', token)
            setUsername(name)
            console.log(name, userId, token);
        });

        newConnection.on('CreateChatroom', (name, id) => {
            localStorage.setItem('chatroom', JSON.stringify({name : name, id : id}))
            setChatroom(name)
        })

    }, []);
    

    return (
        <div>
            <ul>
                {messages.map((msg, index) => (
                    <li key={index}>{msg.user}: {msg.message}</li>
                ))}
            </ul>
            <SendMessage connection={connection}></SendMessage>
            {chatroom && <ul>chatroom</ul>}
            <CreateChatroom connection={connection}></CreateChatroom>
            {username && <b>Name: {localStorage.getItem('name')}</b>}
            {!username && <CreateUser connection={connection}></CreateUser>}
        </div>
    );
};

export default ChatComponent;