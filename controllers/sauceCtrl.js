/* ce fichier sert à crer les fonctions pour les différentes routes Sauce */

//importations
const Sauce = require('../models/sauceModel')
const fs = require('fs')
const ObjectID = require('mongoose').Types.ObjectId

//fonction pour créer une sauce
module.exports.createSauce = async (req, res) => {
    //on récupère les données envoyé par la requête frontend
    const sauceObject = JSON.parse(req.body.sauce)
    const sauce = new Sauce({
        ...sauceObject,
        likes: 0,
        dislikes: 0,
        usersLiked: [],
        usersDisliked: [],
        //on modifie l'url de l'image
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    })
    try {
        //enregistrer le new  produit dans la bd
        await sauce.save()
        //on renovie une réponse au frontend
        return res.status(201).json({message: 'Votre sauce a bien été créée' , sauce})
    }   
    catch(err) { return res.status(400).send(err) }  
}

//fonction pour afficher toutes les sauces
module.exports.getAllSauce = (req, res) => {
    Sauce.find().then(
        (sauces) => {
            res.status(200).json(sauces)
        })
        .catch(
            (err) => { res.status(400).json({err: err})}
        )
}

//fonction pour afficher une sauce
module.exports.getOneSauce = (req, res) => {
   Sauce.findOne ({
       _id : req.params.id
    }).then(
       (sauce) => {
           res.status(200).json(sauce)
    }).catch(
        (err) => {
            res.status(404).json({err: err})
    })
}

//fonction pour mofifer une seule sauce
module.exports.updateSauce = (req, res) => {
    //ternaire pour savoir si on a une image dans la modification ou non
    const sauceObject = req.file?
    {
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
        
    } : {...req.body}
   
    Sauce.updateOne({_id: req.params.id}, {...sauceObject, _id: req.params.id})
    //ça nous retourne une promisse
    .then(() => res.status(200).json({message: " votre sauce a bien été modifiée"}))
    .catch(err => res.status(400).json({err}))
}

//fonction pour supprimer une seule sauce
module.exports.deleteSauce = (req, res) => {
    //on va d'abord cherher notre image
    Sauce.findOne({_id: req.params.id})
    .then(sauce => {
        //on extrait le nom de l'image
        const filename = sauce.imageUrl.split('/images/')[1]
        //on supprime le fichier grace au package fs
        fs.unlink(`images/${filename}`, () =>  {
            //et on supprime tout l'objet avec une callback
            Sauce.deleteOne({_id: req.params.id})
            .then(() => res.status(200).json({message : "votre sauce a bien été supprimée"}))
            .catch(err => res.status(400).json({err}))
        })
    })
    .catch(err => res.status(500).json({err}))
}

//fonction pour liker ou disliker une seule sauce
module.exports.likeSauce = async (req, res) => {
    const userId = req.body.userId
 
    try { 
        //ajouter un like
        if(req.body.like === 1) {
            await Sauce.findByIdAndUpdate(
                req.params.id, // on récupère notre id
                {
                    $inc: {likes: 1}, //on incrémente la valeur des likes
                    $addToSet: {usersLiked: userId} //on ajoute l'id de l'user qui a liké au tableau des usersliked
                }, 
                {new: true}
            )
            console.log("un nouveau like");
            return res.json({message: "sauce likée"})       
        } 
        //ajouter un dislike
        else if (req.body.like === -1) {
            await Sauce.findByIdAndUpdate(
                req.params.id,
                {
                    $inc: {dislikes: 1},
                    $addToSet: {usersDisliked: req.body.userId}
                },
                {new : true}
            )
            console.log("nouveau dislike")
            return res.json({message: "sauce likée"}) 
                
        } 
        //retirer un like ou un dislike
        else if (req.body.like === 0 ) {
            //on récupère l'objet sauce qui correspond à l'id
            const sauce =  await Sauce.findOne({
                _id : req.params.id
            })
            //si on a liké, on retire le like
            if(sauce.usersLiked.includes(req.body.userId)) {
                await Sauce.findByIdAndUpdate(
                    req.params.id, 
                    {
                        $inc: {likes: -1}, 
                        $pull: {usersLiked: req.body.userId}
                    }, 
                    {new: true}
                )
                console.log("like retiré")
                return res.json({message: "like retiré"})
            }  
            //si on a disliké, on retire le dislike
            else if(sauce.usersDisliked.includes(req.body.userId)) {
                await Sauce.findByIdAndUpdate(
                    req.params.id, 
                    {
                        $inc: {dislikes: -1},
                        $pull: {usersDisliked: req.body.userId},
                    }, 
                    {new: true}
                )
            }
            console.log("dislike retiré")
            return res.json({message: "dislike retiré"}) 
        }
    } catch (err) {
        return res.status(500).json({message: err})
    }
}
