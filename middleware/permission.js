/*
ce middelware sert à empecher les users non autorisés de modifier ou de supprimer des sauces
 */
//importation
const ObjectID = require('mongoose').Types.ObjectId

const Sauce = require('../models/sauceModel')


const authManageSauce = async (req, res, next) => {
    //vérifier si l'id qu'on cherche exsiste dans la bdd
    if (!ObjectID.isValid(req.params.id))
        return res.status(400).send(`id inconnu: ${req.params.id}`)
        
    //on récupère l'objet sauce concerné
    const sauce =  await Sauce.findOne({
        _id : req.params.id
    })

    //on récupère l'userId décodé
    const userId = req.body.userIdFromToken 

    //si l'userId de la sauce et l'userId dans le token ne sont 
    //pas les même, on empêche l'exécution la requête
    if (sauce.userId !== userId) {
        res.status(401)
        return res.send("Vous n'êtes pas autorisés à exécuter cette reqêute")
    }
    next()
} 

module.exports = { authManageSauce }