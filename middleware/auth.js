/*ce middleware vérifier la validdité du token envoyé par l'application frontend
et qu'il y a un userID dans la requête envoyée qui correspond 
au userId qui a été encodé dans le token
*/

//importation de jsonwebtoken
const jsonWebToken = require('jsonwebtoken')

module.exports = (req, res, next) => {
    try {
      //on récupère les données d'authorization dans les headers de notres requête
      const authHeader = req.headers['authorization']
      //on extrait le tokende notre authorization [bearer][token]
      const token = authHeader.split(' ')[1] 
      //on va decoder le token et vérifier que le token correspond à la clé secrete
      const decodedToken = jsonWebToken.verify(token, process.env.ACCESS_TOKEN_SECRET) 
      //on récupère le userId qui été dans le token après l'avoir decoder
      const userId = decodedToken.userId 
      //si le userId récupérer de la requete n'est pas le même que notre userId on envoie une erreur 
      if (req.body.userId && req.body.userId !== userId) {
        throw 'user ID non valable' 
      } else {
        //sinon, si tout va bien, on peut passer la requete au prochain middleware
        next() 
      }
    } catch {
      res.status(401).json({ 
        //si en reçoit une erreur on va l'envoyer, sinon on créer une nouvelle erreur 
        error: error || new Error('requête non authentifiée!')
      }) 
    }
} 