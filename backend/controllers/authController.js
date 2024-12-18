const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const usersDb = require('../repositories/usersDb');
const authenticateToken = require('../services/tokenService');

const accessSecretKey = 'HANNA_ACCESS';
const refreshSecretKey = 'HANNA_REFRESH';
const imgSrc = 'data:image/png;base64,';

module.exports = {
  async getResource(req, res) {
    try {
      const user = authenticateToken(req, res);
      if (user) return res.status(200).send(user);
      else return res.status(401).send();
    } catch (error) {
      console.error('Ошибка при получении ресурса:', error);
      return res.status(500).send('Internal Server Error');
    }
  },

  async getLogin(req, res) {
    try {
      res.redirect('http://localhost:3000/login');
    } catch (error) {
      console.error('Ошибка при получении страницы входа:', error);
      return res.status(500).send('Internal Server Error');
    }
  },

  async executeLogout(req, res) {
    try {
      res.clearCookie('accessToken');
      res.clearCookie('refreshToken');
      res.redirect('/auth/login');
    } catch (error) {
      console.error('Ошибка при выполнении выхода:', error);
      return res.status(500).send('Internal Server Error');
    }
  },

  async executeLogin(req, res) {
    try {
      let user = await usersDb.findUserByLogin(req.body.login);
      if (!user || !(await bcrypt.compare(req.body.password, user.Password)))
        return res.status(401).send();
      user.Photo =
        imgSrc + `${user.Photo ? user.Photo.toString('base64') : null}`;

      const accessToken = jwt.sign(
        { id: user.ID, role: user.Role },
        accessSecretKey,
        { expiresIn: '1h' }
      );
      const refreshToken = jwt.sign(
        { id: user.ID, role: user.Role },
        refreshSecretKey,
        { expiresIn: '24h' }
      );

      res.status(200).send({ accessToken, refreshToken });
    } catch (error) {
      console.error('Ошибка при входе:', error);
      return res.status(500).send('Internal Server Error');
    }
  },

  async executeRegister(req, res) {
    try {
      if (await usersDb.findUserByLogin(req.body.login))
        return res.status(409).send();

      let newUser = await usersDb.createEmptyUser(
        req.body.login,
        req.body.password,
        req.body.name,
        req.body.surname
      );

      const accessToken = jwt.sign(
        { id: newUser.ID, role: newUser.Role },
        accessSecretKey,
        { expiresIn: '1h' }
      );
      const refreshToken = jwt.sign(
        { id: newUser.ID, role: newUser.Role },
        refreshSecretKey,
        { expiresIn: '24h' }
      );

      newUser.Photo = imgSrc + null;

      res.status(200).json({ accessToken, refreshToken });
    } catch (error) {
      console.error('Ошибка при регистрации пользователя:', error);
      return res.status(500).send('Internal Server Error');
    }
  },
};
