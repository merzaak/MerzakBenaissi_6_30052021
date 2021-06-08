// ce fichier sert à configurer multer pour la gestion des fichiers 

//importations
const multer = require('multer')

//dictionnaires des extenstions images
const MIME_TYPES = {
    'image/jpg' : 'jpg',
    'image/jpeg' : 'jpg',
    'image/png' : 'png'
}

//création d'un objet pour la configuration du multer
const storage = multer.diskStorage({
    //dans quel dossier enregistrer les fichiers 
    destination: (req, file, callback) => {
        callback(null, 'images' )
    },
    //quel nom de fichier utiliser
    filename: (req, file, callback) => {
        //on génére le nouveau nom du fichier en utilisant le nom original
        //et en éliminant les espaces et les remplacer par des (_)
        const name = file.originalname.split(' ').join('_')
        //application d'une extenstion aux fichiers
        const extenstion = MIME_TYPES[file.mimetype]
        //on créer le nomdu fichier complet
        callback(null, name + Date.now() + '.' + extenstion)
    }
})

//on exporte notre middleware
module.exports = multer({storage}).single('image')