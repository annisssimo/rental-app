import '../../styles/Premise.css';
import axios from 'axios';
import { useState, useEffect } from 'react';
import noPhoto from '../../img/no-photo.png';
const accessToken = localStorage.getItem('accessToken');
const refreshToken = localStorage.getItem('refreshToken');

function RentInfo({ premise }) {
  const [owner, setOwner] = useState({});
  const [isVisibleUserController, setIsVisibleUserController] = useState(false);
  const [rentalStatus, setRentalStatus] = useState('not_sent');

  const handleUser = () => {
    setIsVisibleUserController(!isVisibleUserController);
  };

  const sentRequestToRental = async () => {
    try {
      await axios.post(
        `https://localhost:3441/rental/add`,
        {
          premise: premise.ID,
        },
        {
          headers: {
            Authorization: `${accessToken}; ${refreshToken}`,
          },
        }
      );

      const response = await axios.get(
        `https://localhost:3441/rental/status?premise=${premise.ID}}`,
        {
          headers: {
            Authorization: `${accessToken}; ${refreshToken}`,
          },
        }
      );
      setRentalStatus(response.data);
    } catch (error) {
      console.error('Ошибка загрузки данных:', error);
    }
  };

  const cancelRental = async () => {
    try {
      await axios.delete(`https://localhost:3441/rental/remove`, {
        data: {
          premise: premise.ID,
        },
        headers: {
          Authorization: `${accessToken}; ${refreshToken}`,
        },
      });

      const response = await axios.get(
        `https://localhost:3441/rental/status?premise=${premise.ID}`,
        {
          headers: {
            Authorization: `${accessToken}; ${refreshToken}`,
          },
        }
      );
      setRentalStatus(response.data);
    } catch (error) {
      console.error('Ошибка загрузки данных:', error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log(premise.Image);
        const response = await axios.get(
          `https://localhost:3441/user/person?id=${premise.ID_owner}`,
          {
            headers: {
              Authorization: `${accessToken}; ${refreshToken}`,
            },
          }
        );
        setOwner(response.data);
      } catch (error) {
        console.error('Ошибка загрузки данных:', error);
      }

      try {
        console.log(premise.ID);
        const response = await axios.get(
          `https://localhost:3441/rental/status?premise=${premise.ID}`,
          {
            headers: {
              Authorization: `${accessToken}; ${refreshToken}`,
            },
          }
        );
        setRentalStatus(response.data);
      } catch (error) {
        console.error('Ошибка загрузки данных:', error);
      }
    };

    if (premise && premise.ID_owner) {
      fetchData();
    }
  }, [premise]); // Добавлен premise как зависимость useEffect

  if (!premise || !premise.ID_owner) {
    return <div>Loading...</div>; // Возвращаем заглушку, пока данные не загружены
  }

  return (
    <div className="rentInfo">
      <p className="priceRental">Стоимость аренды:</p>
      <p className="moneyRental">{premise.Price} BYN</p>
      {rentalStatus === 'not_sent' && (
        <button
          style={{ backgroundColor: 'rgb(88, 169, 114)' }}
          className="sentRequestToRental"
          onClick={sentRequestToRental}
        >
          Отправить заявку на аренду
        </button>
      )}
      {rentalStatus === 'considered' && (
        <button
          style={{ backgroundColor: 'rgb(146, 147, 146)' }}
          className="sentRequestToRental"
          onClick={cancelRental}
        >
          Отменить заявку на аренду
        </button>
      )}
      {rentalStatus === 'accepted' && (
        <button
          style={{ backgroundColor: 'rgb(165, 7, 7)' }}
          className="sentRequestToRental"
          onClick={cancelRental}
        >
          Отменить аренду
        </button>
      )}
      <p className="priceRental">Владелец:</p>
      <div className="userInfo">
        <div className="userController" onClick={handleUser}>
          {owner.Photo !== 'data:image/png;base64,null' ? (
            <img
              className="userPhoto"
              style={{ borderRadius: '40px' }}
              src={owner.Photo}
            />
          ) : (
            <img className="userPhoto" src={noPhoto} />
          )}
          <p className="userName">{owner.Login}</p>
          {isVisibleUserController && (
            <div className="userMainInfo">
              <p>Имя: {owner.Name}</p>
              <p>Фамилия: {owner.Surname}</p>
              {owner.PhoneNumber !== 'null' && owner.PhoneNumber !== '' && (
                <p>Телефон: {owner.PhoneNumber}</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default RentInfo;
