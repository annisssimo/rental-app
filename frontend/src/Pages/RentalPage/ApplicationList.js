import '../../styles/Main.css';
import '../../styles/Rentals.css';
import Header from '../MainPage/Header';
import axios from 'axios';
import { useState, useEffect } from 'react';
import noPhoto from '../../img/no-photo.png';
import yes from '../../img/yes.svg';
import no from '../../img/no.svg';
const accessToken = localStorage.getItem("accessToken");
const refreshToken = localStorage.getItem("refreshToken");

function ApplicationList() {
    const [applications, setApplications] = useState([]);

    const sentYesAnswer = async (id, ID_premise) => {
        const response = await axios.put(
            `https://localhost:3441/rental/accept`,
            {
                id: id,
                ID_premise: ID_premise
            },
            {
                headers: {
                    Authorization: `${accessToken}; ${refreshToken}`
                }
            }
        );


        setApplications(applications.filter(application => application.ID_premise !== ID_premise));
    };

    const sentNoAnswer = async (id) => {
        const response = await axios.delete(`https://localhost:3441/rental/remove_by_id`, {
            data: {
                id: id,
            },
            headers: {
                'Authorization': `${accessToken}; ${refreshToken}`
            }
        });

        setApplications(applications.filter(application => application.ID !== id));
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`https://localhost:3441/rental/applications`, {
                    headers: {
                        'Authorization': `${accessToken}; ${refreshToken}`
                    }
                });
                setApplications(response.data);
            } catch (error) {
                console.error('Ошибка загрузки данных:', error);
            }
        };

        // Загрузка данных с сервера при монтировании компонента
        fetchData();
    }, []);

	return (
        <div>
        <Header/>

        <div className="userList">

            {Array.isArray(applications) && applications.map((application) => (
                <a href={`/premise/${application.Premise.ID}`} className="rental">
                    <img src={application.Premise.Image}/>
                    <div className="rentalSenderInfo">
                        <div className='userSenderInfo'>
                            <img src={application.Tenant.Photo}/>
                            <p>{application.Tenant.Login}</p>
                        </div>
                        <div style={{marginTop: '15px'}}>{application.Premise.Name}</div>
                        <div style={{marginTop: '10px'}}>{application.Premise.Price} BYN</div>
                    </div>
                    <div className='responseApplication'>
                        <button onClick={(e) => { e.preventDefault(); sentYesAnswer(application.ID, application.ID_premise); }}><img src={yes}/></button>
                        <button onClick={(e) => { e.preventDefault(); sentNoAnswer(application.ID); }}><img src={no}/></button>
                    </div>

                </a>
            ))}
            
        </div>
        </div>
  	);
}

export default ApplicationList;