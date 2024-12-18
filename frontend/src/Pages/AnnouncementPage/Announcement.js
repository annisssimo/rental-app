import '../../styles/Main.css';
import '../../styles/Rentals.css';
import Header from '../MainPage/Header';
import axios from 'axios';
import React, { useState, useEffect } from 'react';
const accessToken = localStorage.getItem("accessToken");
const refreshToken = localStorage.getItem("refreshToken");

function Announcement() {
    const [announcements, setAnnouncements] = useState([]);
    const [announcement, setAnnouncement] = useState('');

    const ws = new WebSocket('wss://localhost:3441');

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        ws.send(announcement);
        
    };

	useEffect(() => {
        const ws = new WebSocket('wss://localhost:3441');
    
        ws.addEventListener('open', function (event) {
            console.log('WebSocket соединение установлено');
            ws.send('Привет, сервер!');
        });
    
        ws.addEventListener('message', function (event) {
            console.log(event.data);

            setAnnouncements(prevAnnouncements => [...prevAnnouncements, event.data]);
        });
    
        ws.addEventListener('close', function (event) {
            console.log('WebSocket соединение закрыто');
        });
    
        ws.addEventListener('error', function (event) {
            console.error('Произошла ошибка:', event);
        });
    
        return () => {
            // При размонтировании компонента отключаемся от WebSocket
            ws.close();
        };
    }, []);
    

	return (
		<div>
				<Header/>
				<div className="userList" style={{paddingTop: '40px', width: '900px', overflowY: 'auto', height: '565px', maxHeight: '600px', borderRadius: '0px'}}>
                    <div style={{paddingTop: '30px'}}>
                        {Array.isArray(announcements) && announcements.map((announcement) => (
                            <div className="announcement"><p>{announcement}</p></div>
                        ))}
                    </div>
                </div>
		</div>
  	);
}

export default Announcement;
