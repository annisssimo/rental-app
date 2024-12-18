const express = require("express");
const authController = require('../controllers/authController.js');

module.exports = () => {
    const router = express.Router(); 

    router.get('/resource', (req, res) => authController.getResource(req, res));
    router.get('/login', (req, res) => authController.getLogin(req, res));
    router.get('/logout', (req, res) => authController.executeLogout(req, res));
    router.post('/login', (req, res, next) => {authController.executeLogin(req, res, next) });
    router.post('/register', (req, res, next) => {authController.executeRegister(req, res) });
    router.use((req, res) => res.status(404).send('404'));

    return router;
}