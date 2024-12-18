import '../../styles/Main.css';
import '../../styles/Rentals.css';
import noPhoto from '../../img/no-photo.png';
import deleteButton from '../../img/delete.svg';
import axios from 'axios';
import { useState, useEffect } from 'react';
const accessToken = localStorage.getItem('accessToken');
const refreshToken = localStorage.getItem('refreshToken');

function OwnershipList({ premises }) {
  const [premisesList, setPremisesList] = useState([]);

  useEffect(() => {
    setPremisesList(premises);
  }, [premises]);

  const deletePremise = async (id) => {
    try {
      // Отправляем запрос на удаление объекта на сервер
      await axios.delete(`https://localhost:3441/premise/remove`, {
        data: { id: id },
        headers: {
          Authorization: `${accessToken}; ${refreshToken}`,
        },
      });

      premises = premisesList.filter((premise) => premise.ID !== id);
      setPremisesList(premises);
      // Обновляем список помещений, удаляя удаленный объект
    } catch (error) {
      console.error('Ошибка при удалении помещения:', error);
    }
  };

  return (
    <div className="userList">
      <a href="/add_premise" className="addPremiseButton">
        <p>+</p>
      </a>

      <div style={{ marginTop: '20px' }}>
        {Array.isArray(premisesList) &&
          premisesList.map((premise) => (
            <a
              key={premise.ID}
              href={`/edit_premise/${premise.ID}`}
              className="rental"
              style={{ marginTop: '20px' }}
            >
              {premise.Image !== 'data:image/png;base64,null' ? (
                <img src={premise.Image} alt="" />
              ) : (
                <img src={noPhoto} alt="Placeholder" />
              )}
              <div className="name_price">
                <div>{premise.Name}</div>
                <div style={{ marginTop: '25px' }}>{premise.Price} BYN</div>
              </div>
              <button
                className="deleteButton"
                onClick={(e) => {
                  e.preventDefault();
                  deletePremise(premise.ID);
                }}
              >
                <img src={deleteButton} alt="Delete" />
              </button>
            </a>
          ))}
      </div>
    </div>
  );
}

export default OwnershipList;
