import '../../styles/Main.css';
import '../../styles/Rentals.css';
import noPhoto from '../../img/no-photo.png';
import cnacelButton from '../../img/no.svg';
import axios from 'axios';
import { useState, useEffect } from 'react';
const accessToken = localStorage.getItem("accessToken");
const refreshToken = localStorage.getItem("refreshToken");


function MyRentedList() {
    const [rentals, setRentals] = useState([])

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`https://localhost:3441/rental/my`, {
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

    const deleteRental = async (id) => {
        try {
            // Отправляем запрос на удаление объекта на сервер
            await axios.delete(`https://localhost:3441/rental/remove_by_id`, {
                data: {id: id},
                headers: {
                    'Authorization': `${accessToken}; ${refreshToken}`
                }
            });
            
            setRentals(rentals.filter(rental => rental.ID !== id));
            // Обновляем список помещений, удаляя удаленный объект
        } catch (error) {
            console.error("Ошибка при удалении помещения:", error);
        }
    };

	return (
        <div className="userList">
            {Array.isArray(rentals) && rentals.map((rental) => (
                <a href={`/edit_premise/${rental.Premise.ID}`} className="rental">
                    <img src={rental.Premise.Image}/>
                    <div className="name_price">
                        <div>{rental.Premise.Name}</div>
                        <div style={{marginTop: '25px'}}>{rental.Premise.Price} BYN</div>
                    </div>
                    <div className='rentalDate'>
                        {new Date(rental.StartDate).toLocaleDateString()}
                        <button style={{marginTop: '20px', marginLeft: '20px'}} className='deleteButton' onClick={(e) => { e.preventDefault(); deleteRental(rental.ID); }}><img src={cnacelButton}/></button>
                    </div>

                </a>
            ))}
        </div>
  	);
}

export default MyRentedList;