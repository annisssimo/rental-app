import axios from 'axios';
import { useState, useEffect } from 'react';

import '../../styles/Main.css';
import '../../styles/Rentals.css';
import noPhoto from '../../img/no-photo.png';
import deleteButton from '../../img/delete.svg';

const accessToken = localStorage.getItem('accessToken');
const refreshToken = localStorage.getItem('refreshToken');

function UserList({ users }) {
  const [usersList, setUsersList] = useState([]);

  useEffect(() => {
    setUsersList(users);
  }, [users]);

  const deletePremise = async (id) => {
    try {
      // Отправляем запрос на удаление объекта на сервер
      await axios.delete(`https://localhost:3441/user/remove`, {
        data: { id: id },
        headers: {
          Authorization: `${accessToken}; ${refreshToken}`,
        },
      });

      users = usersList.filter((user) => user.ID !== id);
      setUsersList(users);
      // Обновляем список помещений, удаляя удаленный объект
    } catch (error) {
      console.error('Ошибка при удалении помещения:', error);
    }
  };

  return (
    <div className="userList" style={{ paddingTop: '40px' }}>
      <a href="/add_user" className="addPremiseButton">
        <p>+</p>
      </a>

      <div style={{ paddingTop: '30px' }}>
        {Array.isArray(usersList) &&
          usersList.map((user) => (
            <a key={user.ID} href={`/edit_user/${user.ID}`} className="rental">
              {user.Photo !== 'data:image/png;base64,null' ? (
                <img src={user.Photo} alt="" style={{ width: '190px' }} />
              ) : (
                <img
                  src={noPhoto}
                  alt="Placeholder"
                  style={{ width: '190px' }}
                />
              )}
              <div className="name_price">
                <div>{user.Login}</div>
              </div>
              <button
                style={{ marginLeft: '100px' }}
                className="deleteButton"
                onClick={(e) => {
                  e.preventDefault();
                  deletePremise(user.ID);
                }}
              >
                <img src={deleteButton} alt="delete button" />
              </button>
            </a>
          ))}
      </div>
    </div>
  );
}

export default UserList;
