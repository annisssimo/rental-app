import '../../styles/Main.css';
import '../../styles/User.css';
import noPhoto from '../../img/no-photo.png';
import axios from 'axios';
import React, { useState, useEffect } from 'react';
const accessToken = localStorage.getItem('accessToken');
const refreshToken = localStorage.getItem('refreshToken');

function UserParams() {
  const [errorText, setErrorText] = useState('');
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [login, setLogin] = useState('');
  const [ava, setAva] = useState(null);
  const [ava2, setAva2] = useState(null);

  useEffect(() => {
    const setUserValue = async () => {
      const response = await axios.get(`https://localhost:3441/user/my`, {
        headers: {
          Authorization: `${accessToken}; ${refreshToken}`,
        },
      });
      const user = response.data;

      setName(user.Name);
      setSurname(user.Surname);
      if (user.PhoneNumber === null) setPhoneNumber('');
      else setPhoneNumber(user.PhoneNumber);
      setLogin(user.Login);
      if (user.Photo !== 'data:image/png;base64,null') setAva(user.Photo);
      else setAva(noPhoto);
    };

    setUserValue();
  }, []);

  const save = async (e) => {
    if (name === '' || surname === '') {
      setErrorText('Вы не заполнили все поля!');
      return;
    }

    let belPattern = new RegExp('^375[0-9]{9}$');
    if (!belPattern.test(phoneNumber) && phoneNumber !== '') {
      setErrorText('Номер телефона введён некоретно');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('surname', surname);
      formData.append('phoneNumber', phoneNumber);
      formData.append('login', login);

      // Добавляем фото только если ava2 не null
      if (ava2 !== null) {
        formData.append('photo', ava2);
      }

      await axios.put('https://localhost:3441/user/edit', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `${accessToken}; ${refreshToken}`,
        },
      });

      window.location.href = '/';
    } catch (error) {
      console.error('Ошибка при изменении данных пользователя:', error);
    }
  };

  const changeAva = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    setAva2(file);
    reader.onloadend = () => {
      setAva(reader.result);
    };

    if (file) {
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="userParams">
      <div className="avaController">
        {ava !== 'data:image/png;base64,null' ? (
          <img src={ava} alt="" />
        ) : (
          <img src={noPhoto} alt="Placeholder" />
        )}
        <div className="login">{login}</div>
        <input type="file" accept="image/*" onChange={changeAva} />
      </div>

      <form className="userForm">
        <input
          placeholder="Имя"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          placeholder="Фамилия"
          value={surname}
          onChange={(e) => setSurname(e.target.value)}
        />
        <input
          placeholder="Номер телефона"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
        />
      </form>

      <div className="underUserParams">
        <p id="errorMessage" style={{ marginTop: '15px' }}>
          {errorText}{' '}
        </p>
        <button className="saveButton" onClick={save}>
          Сохранить измения
        </button>
      </div>
    </div>
  );
}

export default UserParams;
