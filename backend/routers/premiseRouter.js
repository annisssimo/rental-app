const express = require("express");
const premiseController = require('../controllers/premiseController.js');
const multer = require('multer');
const path = require('path');

module.exports = () => {
    const router = express.Router(); 

    const storage = multer.diskStorage({
        destination: function (req, file, cb) {
          	cb(null, 'uploads/');
        },
        filename: function (req, file, cb) {
          	const fileName = 'premise' + path.extname(file.originalname);
          	cb(null, fileName);
        }
    });

    const upload = multer({ storage: storage });

    router.get('/all', (req, res) => premiseController.getPremises(req, res));
    router.get('/my', (req, res) => premiseController.getMyPremises(req, res));
    router.get('/my_rented', (req, res) => premiseController.getMyRentedPremises(req, res));
    router.get('/element', (req, res) => premiseController.getPremise(req, res));
    router.post('/add', upload.single('photo'), (req, res) => premiseController.addPremise(req, res));
    router.put('/edit', upload.single('photo'), (req, res) => premiseController.editPremise(req, res));
    router.delete('/remove', (req, res) => premiseController.deletePremise(req, res));
    router.use((req, res) => res.status(404).send('404'));

    return router;
}