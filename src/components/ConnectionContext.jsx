import React, { createContext, useState, useEffect } from 'react';
import * as signalR from '@microsoft/signalr';

export const ConnectionContext = createContext();
export const ConnectionProvider = ({ children }) => {
    const [connection, setConnection] = useState(null);
    useEffect(() => {
        const newConnection = new signalR.HubConnectionBuilder()
        .withUrl('http://localhost:5075/chatHub')
        .withAutomaticReconnect()
        .build();

        setConnection(newConnection);

        newConnection.start()
            .then(() => {
                console.log('Connection established.')
                newConnection.send("ConnectUser", localStorage.getItem('token'), JSON.parse(localStorage.getItem('chatroom')).id);
                if(localStorage.getItem('chatroom')){
                    newConnection.send("GetMessages", JSON.parse(localStorage.getItem('chatroom')).id)
                }
            })
            .catch(error => console.error('Error establishing connection:', error));
    }, [])
    return (
        <ConnectionContext.Provider value={connection}>
        {children}
        </ConnectionContext.Provider>
    );
};