/* ce fichier sert à créer des shémas de données pour la création d'un User */

// importations
const mongoose = require('mongoose') 
const uniqueValidator = require('mongoose-unique-validator')

//création du model des données pour les utilisateurs
const userSchema = mongoose.Schema({
    email: { type: String, required: true,unique: true },
    password: { type: String, required: true }
})

//application de unique validator à notre model
userSchema.plugin(uniqueValidator)
  
//exporter le model
module.exports = mongoose.model('User', userSchema)