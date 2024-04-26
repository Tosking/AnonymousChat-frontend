import React, { useState, useEffect, useContext } from 'react';
import { ConnectionContext } from './ConnectionContext';
import CreateUser from './CreateUser';
import CreateChatroom from './CreateChatroom';
import SendMessage from './SendMessage';
import JoinChatroom from './JoinChatroom';

const ChatComponent = () => {

    const [messages, setMessages] = useState([]);
    const [chatrooms, setChatrooms] = useState([]);
    const [username, setUsername] = useState('');
    const [chatroom, setChatroom] = useState('');

    const connection = useContext(ConnectionContext)

    useEffect(() => {
        if(!connection) return
        setUsername(localStorage.getItem('name'))
        setChatroom(JSON.parse(localStorage.getItem('chatroom')).name)

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
            connection.send("GetMessages", localStorage.getItem('token'), id)
        })

        connection.on('GetMessages', (messagesFromDB) => {
            for(const i in messagesFromDB){
                if(!messages.some(u => {
                    return messagesFromDB[i].Id == u.id
                })) setMessages(prevMessages => [...prevMessages, { id: messagesFromDB[i].Id, user: messagesFromDB[i].userId.toString(), message: messagesFromDB[i].content }]);
                console.log(i, messagesFromDB[i])
            }
        })
        connection.on('GetChatrooms', (chatroomsFromDb) => {
            console.log(chatroomsFromDb)
            for(const i in chatroomsFromDb){
                setChatrooms(prevChatrooms => [...prevChatrooms, {name: chatroomsFromDb[i].name, id: chatroomsFromDb[i].id}])
            }
            console.log(chatrooms)
        })

        connection.on('Error', (err) => {
            alert(err)
        })

    }, [connection]);
    

    return (
        <div>
            <div className='chatrooms-list'>
                {chatrooms.map(chat => <button className='chatroom-button' onClick={() => connection.send("JoinChatroom", localStorage.getItem('token'), chat.id)}>{chat.name}</button>)}
            </div>
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