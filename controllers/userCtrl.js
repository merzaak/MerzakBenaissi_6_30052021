/* ce fichier sert à creer les fonctions pour les différentes routes User */

//importation
const bcrypt = require('bcrypt') 
const jsonWebToken = require('jsonwebtoken')
const Joi = require('joi')

const User = require('../models/userModel') 
const {validateInput} = require('../middleware/joiValidation')


/****************************************************************/
///////////////////fonction pour la création d'un nouveau User////
/****************************************************************/
exports.signup = (req, res, next) => {

  //on récupère les inputs parès validation par Joi
  const result = validateInput.validate(req.body)
  if(result.error) {
    return res.status(400).send(result.error.details[0].message)
  }

  //on hashe le mot de passe 
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
            token: jsonWebToken.sign(
              {userId : user._id}, //les données qu'on veut encoder 
              process.env.ACCESS_TOKEN_SECRET, //l'expression de token
              {expiresIn : '24h'} //temps de validité de token
            )
          }) 
        })
        .catch(error => res.status(500).json({ error })) 
    })
    .catch(error => res.status(500).json({ error })) 
}