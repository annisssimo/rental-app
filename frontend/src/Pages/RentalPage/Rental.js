import '../../styles/Main.css';
import axios from 'axios';
import { useState, useEffect } from 'react';
import Header from '../MainPage/Header';
import RentalList from './RentalList';
const accessToken = localStorage.getItem("accessToken");
const refreshToken = localStorage.getItem("refreshToken");

function Rental() {
    const [rentals, setRentals] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`https://localhost:3441/rental/all`, {
                    headers: {
                        'Authorization': `${accessToken}; ${refreshToken}`
                    }
                });
                setRentals(response.data);
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
				<RentalList rentals={rentals}/>
			</div>
		</div>
  	);
}

export default Rental;
