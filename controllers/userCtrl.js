/* ce fichier sert à creer les fonctions pour les différentes routes User */

//importation
const bcrypt = require('bcrypt') 
const jsonWebToken = require('jsonwebtoken')

const User = require('../models/userModel') 
const {validateInput} = require('../middleware/joiValidation')


/****************************************************************/
////////////fonction pour la création d'un nouveau User///////////
/****************************************************************/
exports.signup = async (req, res, next) => {
  
  //on récupère les inputs parès validation par Joi
  const result = validateInput.validate(req.body)
  //si il y a une erreur, on envoie un message d'erreur
  if(result.error) {
    return res.status(400).send(result.error.details[0].message)
  }

  //on hashe le mot de passe 
  const hashedPassword = await bcrypt.hash(result.value.password, 10) 

  //on instancie un nouveau utilisateur avec le mot de passe hashé
  const user = new User({
      email: result.value.email,
      password: hashedPassword
  })

  //on enregistre le nouveau utilisateur 
  try {
      const savedUser =  await user.save()
      res.status(201).json({ message: `Utilisateur créé, son id est le ${savedUser._id}` })
  } catch (error) {
      res.status(400).json({ error })
  }
    
}

/****************************************************************/
////////fonction pour la connexion d'un user déjà membre//////////
/****************************************************************/
exports.login = async (req, res, next) => { 

  //on récupère l'utilisateur qui correspond à l'email entré
  const user = await User.findOne({ email: req.body.email })
 
  //verification de l'existance de l'email
  if (!user) {
        return res.status(401).json({ error: 'Utilisateur non trouvé !' }) 
  }

  //on récupère le hash et on le compare s'il correspond avec le mot de passe 
  const validPassword = await  bcrypt.compare(req.body.password, user.password)

  //si le mot de passe n'est pas le meme on renvoie une erreur 
  if(!validPassword) {
      return res.status(401).json({ error: 'Mot de passe incorrect !' })
  }
  
  //si le mot de passe est bon, on crée le token avec notre user._id
  try {
    res.status(200).json({
      userId: user._id,
      token: jsonWebToken.sign(
        {userId : user._id}, //les données qu'on veut encoder 
        process.env.ACCESS_TOKEN_SECRET, //l'expression de token
        {expiresIn : '24h'} //temps de validité de token
      )
    }) 
  }
  catch (err)
  {
    res.status(500).json({ err })
  }  
}