/* ce fichier sert à créer la logique de routing pour la création d'un User */

//importation d'express
const express = require('express')
//on utilise la methode Router d'express
const router = express.Router()

//importer les controllers 
const userCtrl = require('../controllers/userCtrl')

//les routes user
router.post('/signup', userCtrl.signup) //pour l'inscription


//on exporte notre router
module.exports = router;