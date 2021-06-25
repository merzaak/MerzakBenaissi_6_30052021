/* ce fichier sert à créer la logique de routing pour la création et la connexion d'un User  */

//importation
const express = require('express')
const userCtrl = require('../controllers/userCtrl')

const router = express.Router()


//les routes user
router.post('/signup', userCtrl.signup) 
router.post('/login', userCtrl.login) 

//on exporte notre router
module.exports = router