/* ce fichier sert à créer la logique de routing pour la création d'un User */

//importations 
const express = require('express')
const router = express.Router() // la methode Router d'express

//importer les controllers  et l'authentification
const sauceCtrl = require('../controllers/sauceCtrl')
const auth = require('../middleware/auth')
const multer  = require('../middleware/multer')


//les routes Sauce
router.post('/', auth, multer, sauceCtrl.createSauce )
router.get('/', auth, sauceCtrl.getAllSauce )
router.get('/:id', auth, sauceCtrl.getOneSauce )
router.put('/:id', auth, multer, sauceCtrl.updateSauce )
router.delete('/:id', auth, sauceCtrl.deleteSauce )
router.patch('/:id/like', auth, sauceCtrl.likeSauce )

//on exporte notre router
module.exports = router