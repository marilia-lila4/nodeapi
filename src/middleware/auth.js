const jwt = require('jsonwebtoken')
const User = require('../models/User')

const auth = async(req, res, next) => {
    const token = req.header('Authorization').replace('Bearer ', '') // Ter acesso ao token
    const data = jwt.verify(token, process.env.JWT_KEY) //Verificar se o token é válido ou se foi criado usando o JWT_KEY
    try {
        const user = await User.findOne({ _id: data._id, 'tokens.token': token })
        if (!user) {
            throw new Error()
        }
        req.user = user //encontrar usuário
        req.token = token // encontrar token
        next() //ie para o proximo middleware
    } catch (error) {
        res.status(401).send({ error: 'Sem autorização ao acesso.' })
    }

}
module.exports = auth