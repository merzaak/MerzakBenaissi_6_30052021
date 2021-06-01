//importations
const express = require('express') 
const mongoose = require('mongoose') 

const app = express() //création d'une application express

//importation des routers user
const userRoute = require('./routes/userRoutes')

//connection de notre API à la base de donnée MangoDB grâce au package mangoose
mongoose.connect('mongodb+srv://merzaak:16111989.Hec@cluster0.rxhzi.mongodb.net/PekockoDB?retryWrites=true&w=majority',
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

app.use((req, res) => {
   res.json({ message: 'Votre requête a bien été reçue !' }); 
});

module.exports = app;