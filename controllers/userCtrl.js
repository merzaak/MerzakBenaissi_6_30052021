/* ce fichier sert à crer les fonctions pour les différentes routes User */

//importation du package bcrypt
/*
// ce package  utilise un algorithme unidirectionnel pour 
// chiffrer et créer un hash des mots de passe
*/
const bcrypt = require('bcrypt') 


//importation du model User
const User = require('../models/userModel') 

//fonction pour la création d'un nouveau User
exports.signup = (req, res, next) =>{
  //fonction pour hasher le mot de passe
    bcrypt.hash(req.body.password, 10) 
    .then(hash => {
        const user = new User({
            email: req.body.email,
            password: hash
        });
        user.save()
        .then(() => res.status(201).json({ message: 'Utilisateur créé !' }))
        .catch(error => res.status(400).json({ error }));
    })
    .catch(error => res.status(500).json({ error }));
}

