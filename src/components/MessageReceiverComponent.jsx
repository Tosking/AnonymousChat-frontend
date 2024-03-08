import React, { useState, useEffect, useContext } from 'react';
import { ConnectionContext } from './ConnectionContext';
import CreateUser from './CreateUser';
import CreateChatroom from './CreateChatroom';
import SendMessage from './SendMessage';
import JoinChatroom from './JoinChatroom';

const ChatComponent = () => {

    const [messages, setMessages] = useState([]);
    const [username, setUsername] = useState('');
    const [chatroom, setChatroom] = useState('');

    const connection = useContext(ConnectionContext)

    useEffect(() => {
        if(!connection) return
        setUsername(localStorage.getItem('name'))
        setChatroom(localStorage.getItem('chatroom'))

        connection.on('ReceiveMessage', (user, message) => {
            setMessages(prevMessages => [...prevMessages, { user, message }]);
        });
    
        connection.on('CreateUser', (name, userId, token) => {
            localStorage.setItem('name', name)
            localStorage.setItem('userId', userId)
            localStorage.setItem('token', token)
            setUsername(name)
            console.log(name, userId, token);
        });
    
        connection.on('JoinChatroom', (name, id) => {
            console.log(name, id)
            localStorage.setItem('chatroom', JSON.stringify({name : name, id : id}))
            setChatroom(name)
        })

        connection.on('GetMessages', (messages) => {
            console.log(messages)
        })

        connection.on('Error', (err) => {
            alert(err)
        })

    }, [connection]);
    

    return (
        <div>
            <ul className='messages-block'>
                <div className='messages-wrapper'>
                    {messages.map((msg, index) => 
                        {return msg.user !== localStorage.getItem('userId') ? (
                            <div className='message-foreign' key={index}>{msg.user}: {msg.message}</div>
                        ) : <div className='message-user' key={index}>{msg.user}: {msg.message}</div>}
                    )}
                </div>
            </ul>
            <SendMessage></SendMessage>
            {chatroom && <ul>{chatroom}</ul>}
            <CreateChatroom></CreateChatroom>
            <JoinChatroom></JoinChatroom>
            {username && <b>Name: {localStorage.getItem('name')}</b>}
            {!username && <CreateUser></CreateUser>}
        </div>
    );
};

export default ChatComponent;