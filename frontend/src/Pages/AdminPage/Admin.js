import '../../styles/Main.css';
import Header from '../MainPage/Header';
import UserList from './UserList';
import axios from 'axios';
import React, { useState, useEffect } from 'react';
const accessToken = localStorage.getItem("accessToken");
const refreshToken = localStorage.getItem("refreshToken");

function Admin() {
    const [users, setUsers] = useState([]);

	useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`https://localhost:3441/user/all`, {
                    headers: {
                        'Authorization': `${accessToken}; ${refreshToken}`
                    }
                });
                let users = response.data;
                
                setUsers(users);
            } catch (error) {
                console.error('Ошибка загрузки данных:', error);
            }
        };

        // Загрузка данных с сервера при монтировании компонента
        fetchData();
    }, []);

	return (
		<div>
			<div>
				<Header/>
				<UserList users={users}/>
			</div>
		</div>
  	);
}

export default Admin;
