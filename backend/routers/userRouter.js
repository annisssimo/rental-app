const express = require("express");
const userController = require('../controllers/userController.js');
const multer = require('multer');
const path = require('path');

module.exports = () => {
    const router = express.Router(); 

    const storage = multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, 'uploads/');
        },
        filename: function (req, file, cb) {
            const fileName = 'ava' + path.extname(file.originalname);
            cb(null, fileName);
        }
    });

    const upload = multer({ storage: storage });

    router.put('/edit', upload.single('photo'), (req, res) => userController.editUser(req, res));
    router.put('/edit_by_id', upload.single('photo'), (req, res) => userController.editUserById(req, res));
    router.post('/add', upload.single('photo'), (req, res) => userController.addUser(req, res));
    router.get('/person', (req, res) => userController.getUser(req, res));
    router.get('/my', (req, res) => userController.getMyUser(req, res));
    router.get('/all', (req, res) => userController.getAllUser(req, res));
    router.delete('/remove', (req, res) => userController.deleteUser(req, res));
    router.use((req, res) => res.status(404).send('404'));

    return router;
}