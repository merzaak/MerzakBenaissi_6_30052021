/* ce fichier sert à créer des shémas de données pour la création des sauces */

// importations
const mongoose = require('mongoose') 

//création du model des données pour les sauces
const sauceSchema = mongoose.Schema({
   userId : {type : String, required : true},
   name : {type : String, required : true},
   manufacturer :{type : String, required : true},
   description :{type : String, required : true},
   mainPepper : {type : String, required : true},
   imageUrl : {type : String, required : true},
   heat : {type : Number, required : true},
   likes: {type: Number, required: true},
   dislikes: {type: Number, required: true},
   userLiked: {type: [String], required: true},
   userDisliked: {type: [String], required: true}
})


  
//exporter le model
module.exports = mongoose.model('Sauce', sauceSchema)