const express = require("express");
const typePremiseController = require('../controllers/typePremiseController.js');

module.exports = () => {
    const router = express.Router(); 

    router.get('/all', (req, res) => typePremiseController.getTypesPremise(req, res));
    router.get('/type', (req, res) => typePremiseController.getTypePremise(req, res));
    router.use((req, res) => res.status(404).send('404'));

    return router;
}