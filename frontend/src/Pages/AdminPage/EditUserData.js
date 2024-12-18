import '../../styles/Main.css';
import '../../styles/Owner.css';
import noPhoto from '../../img/no-photo.png';
import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
const accessToken = localStorage.getItem('accessToken');
const refreshToken = localStorage.getItem('refreshToken');

function EditUserData() {
  const location = useLocation();
  const segments = location.pathname.split('/');
  const id = segments[segments.length - 1];

  const [errorText, setErrorText] = useState('');
  const [photo, setPhoto] = useState(noPhoto);
  const [photo2, setPhoto2] = useState(null);
  const [role, setRole] = useState('Арендатор');
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `https://localhost:3441/user/person?id=${id}`,
          {
            headers: {
              Authorization: `${accessToken}; ${refreshToken}`,
            },
          }
        );
        const user = response.data;
        if (user.Photo === 'data:image/png;base64,null') setPhoto(noPhoto);
        else {
          setPhoto(user.Photo);
        }

        setName(user.Name);
        setLogin(user.Login);
        setName(user.Name);
        setSurname(user.Surname);
        setPhoneNumber(user.PhoneNumber);
        setRole(user.Role);

        switch (user.Role) {
          case 0:
            setRole('Арендатор');
            break;
          case 1:
            setRole('Владелец');
            break;
          case 2:
            setRole('Администратор');
            break;
          default:
            setRole('Арендатор');
            break;
        }
      } catch (error) {
        console.error('Ошибка загрузки данных:', error);
      }
    };

    // Загрузка данных с сервера при монтировании компонента
    fetchData();
  }, []);

  const edit = async (e) => {
    if (login === '' || name === '' || surname === '') {
      setErrorText('Логин, имя, фамлия обязательно должны быть заполнены!');
      return;
    }

    let belPattern = new RegExp('^375[0-9]{9}$');
    if (!belPattern.test(phoneNumber) && phoneNumber !== '') {
      setErrorText('Номер телефона введён некоретно');
      return;
    }

    try {
      //получить id из url
      const formData = new FormData();
      formData.append('id', id);
      formData.append('name', name);
      formData.append('surname', surname);
      formData.append('login', login);
      formData.append('photo', photo2);
      formData.append('password', password);
      formData.append('phoneNumber', phoneNumber);

      switch (role) {
        case 'Арендатор':
          formData.append('role', 0);
          break;
        case 'Владелец':
          formData.append('role', 1);
          break;
        case 'Администратор':
          formData.append('role', 2);
          break;
        default:
          formData.append('role', 0);
          break;
      }

      await axios.put('https://localhost:3441/user/edit_by_id', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `${accessToken}; ${refreshToken}`,
        },
      });

      window.location.href = '/';
    } catch (error) {
      console.error('Ошибка при изменении данных пользователя:', error);
      if (error.response.status === 409) {
        setErrorText('Пользователь с таким логином уже существует!');
        return;
      }
    }
  };

  const changePhoto = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    setPhoto2(file);
    reader.onloadend = () => {
      setPhoto(reader.result);
    };

    if (file) {
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="premiseData" style={{ minHeight: '800px' }}>
      <form className="premisePhotoController">
        <img src={photo} alt="" />
        <input
          type="file"
          accept="image/*"
          className="loadPremisePhoto"
          onChange={changePhoto}
        />
        <input
          type="text"
          className="premiseName"
          placeholder="Логин"
          value={login}
          onChange={(e) => setLogin(e.target.value)}
        />
        <input
          type="password"
          className="premiseName"
          placeholder="Пароль"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <input
          type="text"
          className="premiseName"
          placeholder="Имя"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="text"
          className="premiseName"
          placeholder="Фамилия"
          value={surname}
          onChange={(e) => setSurname(e.target.value)}
        />
        <input
          type="text"
          className="premiseName"
          placeholder="Номер телефона"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
        />
        <div className="selectRole">
          <label>
            <input
              type="radio"
              value="Арендатор"
              checked={role === 'Арендатор'}
              onChange={(e) => setRole(e.target.value)}
            />
            Арендатор
          </label>
          <label>
            <input
              type="radio"
              value="Владелец"
              checked={role === 'Владелец'}
              onChange={(e) => setRole(e.target.value)}
            />
            Владелец
          </label>

          <label>
            <input
              type="radio"
              value="Администратор"
              checked={role === 'Администратор'}
              onChange={(e) => setRole(e.target.value)}
            />
            Администратор
          </label>
        </div>
      </form>

      <p id="errorMessage" style={{ marginTop: '15px' }}>
        {errorText}
      </p>
      <button className="addButton" onClick={edit}>
        Изменить
      </button>
    </div>
  );
}

export default EditUserData;
