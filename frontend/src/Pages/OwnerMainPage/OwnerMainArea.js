import '../../styles/Main.css';
import '../../styles/Rentals.css';
import '../../styles/Owner.css';
import axios from 'axios';
import { useState, useEffect } from 'react';
import OwnershipList from './OwnershipList';
import MyRentedList from './MyRentedList';
const accessToken = localStorage.getItem("accessToken");
const refreshToken = localStorage.getItem("refreshToken");


function OwnerMainArea() {
    const [mode, setMode] = useState('login');
    const [premises, setPremises] = useState([]);


    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`https://localhost:3441/premise/my`, {
                    headers: {
                        'Authorization': `${accessToken}; ${refreshToken}`
                    }
                });
                let premise = response.data;
                
                setPremises(response.data);
            } catch (error) {
                console.error('Ошибка загрузки данных:', error);
            }
        };

        // Загрузка данных с сервера при монтировании компонента
        fetchData();
    }, []);


    const switchToLogin = async () => {
        setMode('login');
        try {
            const response = await axios.get(`https://localhost:3441/premise/my`, {
                headers: {
                    'Authorization': `${accessToken}; ${refreshToken}`
                }
            });
            setPremises(response.data);
            } catch (error) {
                console.error('Ошибка загрузки данных:', error);
        }
    };

    const switchToRegister = async () => {
        setMode('register');
        try {
            const response = await axios.get(`https://localhost:3441/premise/my_rented`, {
                headers: {
                    'Authorization': `${accessToken}; ${refreshToken}`
                }
            });
            setPremises(response.data);
            } catch (error) {
                console.error('Ошибка загрузки данных:', error);
        }
    };
  
    const activeLoginModeStyle = {
        backgroundColor: mode === 'login' ? 'rgb(60, 80, 254)' : 'transparent', // изменение цвета фона
        color: mode === 'login' ? 'white' : 'black', // изменение цвета текста
        border: 'none', // удаление границы
        borderRadius: '8px',
        cursor: 'pointer', // курсор при наведении
    };

    const activeRegisterModeStyle = {
        backgroundColor: mode === 'register' ? 'rgb(60, 80, 254)' : 'transparent', // изменение цвета фона
        color: mode === 'register' ? 'white' : 'black', // изменение цвета текста
        border: 'none', // удаление границы
        borderRadius: '8px',
        cursor: 'pointer', // курсор при наведении
    };

	return (
        <div className="userList">
            <div className='changeOwnerList'>
                    <button style={activeLoginModeStyle} onClick={switchToLogin}>Мои помещения</button>
					<button style={activeRegisterModeStyle}onClick={switchToRegister}>Арендуемые</button>
            </div>
            {mode === 'login' && <OwnershipList premises={premises}/>}
            {mode === 'register' && <MyRentedList/>}
        </div>
  	);
}

export default OwnerMainArea;