/* ce fichier sert à crer les fonctions pour les différentes routes User */

//importation du package bcrypt
/*
// ce package  utilise un algorithme unidirectionnel pour 
// chiffrer et créer un hash des mots de passe
*/
const bcrypt = require('bcrypt') 


//importation du model User
const User = require('../models/userModel') 

/*****************************************************************************************/
///////////////////fonction pour la création d'un nouveau User/////////////////////////////
/*****************************************************************************************/
exports.signup = (req, res, next) =>{
  //fonction pour hasher le mot de passe salé 10 fois
    bcrypt.hash(req.body.password, 10) 
    //on crée l'utilisateur et on stock le hash à la place de mot de passe
    .then(hash => {
        const user = new User({
            email: req.body.email,
            password: hash 
        }) 
        user.save()
        //on envoie un message de réussite ou d'erreur
        .then(() => res.status(201).json({ message: 'Utilisateur créé !' }))
        .catch(error => res.status(400).json({ error })) 
    })
    .catch(error => res.status(500).json({ error })) 
}

/*****************************************************************************************/
//////////////////////fonction pour la connexion d'un user déjà membre////////////////////
/*****************************************************************************************/
exports.login = (req, res, next) =>{
  //on récupère l'utilisateur qui correspond à l'email entré
    User.findOne({ email: req.body.email })
    .then(user => {
      //si l'email n'est pas bon, on renvoie une erreur
      if (!user) {
        return res.status(401).json({ error: 'Utilisateur non trouvé !' }) 
      }
      //si le mail est bon, on compare les mots de passe entré et celui dans la base de données
      bcrypt.compare(req.body.password, user.password)
        //on reçoit un boolean true or false
        .then(valid => {
          //si le mot de passe n'est pas le meme on renvoie une erreur 
          if (!valid) {
            return res.status(401).json({ error: 'Mot de passe incorrect !' }) 
          }
          //si le mot de passe est bon, on lui renvoie son userId et le TOKEN
          res.status(200).json({
            userId: user._id,
            token: 'token'
          }) 
        })
        .catch(error => res.status(500).json({ error })) 
    })
    .catch(error => res.status(500).json({ error })) 
}