//importations
const express = require('express') 
const mongoose = require('mongoose') 
const bodyParser = require('body-parser') 
require('dotenv').config({path: './.env'})
const path = require('path')

const app = express() //création d'une application express

//importation des routers user et sauce
const userRoute = require('./routes/userRoutes')
const sauceRoute = require('./routes/sauceRoutes')

//connection de notre API à la base de donnée MangoDB grâce au package mangoose
mongoose.connect('mongodb+srv://' + process.env.DB_USER_PASS + '@cluster0.rxhzi.mongodb.net/PekockoDB?retryWrites=true&w=majority',
  { useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false 
})
    .then(() => console.log('Connexion à MongoDB réussie !'))
    .catch((err) => console.log('Connexion à MongoDB échouée !', err))

//CORS 
app.use((req, res, next) => { 
    // permet d'accéder à notre API depuis n'importe quelle origine
    res.setHeader('Access-Control-Allow-Origin', '*')
    //permet d'ajouter les headers mentionnés aux requêtes envoyées vers notre API
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization')
    //permet d'envoyer des requêtes avec les méthodes mentionnées ( GET ,POST..)
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS')
    next()
})

//pour transformer le corps de la requête en objet javascript utilisable
app.use(bodyParser.json())

//middleware pour gérer les images
app.use('/images', express.static(path.join(__dirname,'images')))
//les routes user
app.use('/api/auth', userRoute)
//les routes sauces
app.use('/api/sauces', sauceRoute)

module.exports = app