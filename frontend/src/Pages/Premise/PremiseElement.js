import '../../styles/Premise.css';
import noPhoto from '../../img/no-photo.png';

import PremiseInfo from './PremiseInfo';
import RentInfo from './RentInfo';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import { useState, useEffect } from 'react';
const accessToken = localStorage.getItem("accessToken");
const refreshToken = localStorage.getItem("refreshToken");

function PremiseElement() {
    const location = useLocation();
	const segments = location.pathname.split('/');
	const id = segments[segments.length - 1];
    
	const [premise, setPremise] = useState({});
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`https://localhost:3441/premise/element?id=${id}`, {
                    headers: {
                        'Authorization': `${accessToken}; ${refreshToken}`
                    }
                });
                console.log(response.data);
                if(response.data.Image === 'null') {response.data.Image = noPhoto}
                setPremise(response.data);
            } catch (error) {
                console.error('Ошибка загрузки данных:', error);
            }
        };

        // Загрузка данных с сервера при монтировании компонента
        fetchData();
    }, []);

	return (
	    <div className="premiseElement">

			<PremiseInfo premise={premise}/>
			<RentInfo premise={premise}/>
        </div>
  	);
}

export default PremiseElement;