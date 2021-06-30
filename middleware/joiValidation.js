/* ce fichier sert à créer un midlleware pour valider les inputs lors de la création d'un user */

//importation de Joi
const Joi = require('joi')

const validateInput = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(8).regex(RegExp(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)).required()
})

module.exports = {
  validateInput
}