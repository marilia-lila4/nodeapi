const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        validate: value => {
            if (!validator.isEmail(value)) {
                throw new Error({error: 'Endereço de email inválido'})
            }
        }
    },
    password: {
        type: String,
        required: true,
        minLength: 7
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }]
})

userSchema.pre('save', async function (next) {
    // Hash a senha antes de salvar o modelo do usuário
    // Quando o usuário insere a senha, calcula-se a função Hash da senha e o servidor compara com o resumo armazenado. Se os resumos forem iguais, o usuário é autenticado.
    const user = this
    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8)
    }
    next()
})

userSchema.methods.generateAuthToken = async function() {
    // Gerar um token de autenticação para o usuário. Caso o usuário conecte no dispositivo A e o mesmo se conectar ao dispositvo B irá funcionar.
    const user = this
    const token = jwt.sign({_id: user._id}, process.env.JWT_KEY)
    user.tokens = user.tokens.concat({token})
    await user.save()
    return token
}

userSchema.statics.findByCredentials = async (email, password) => {
    // Procurar um usuário por email e senha.
    const user = await User.findOne({ email} )
    if (!user) {
        throw new Error({ error: 'Login ou senha inválida' })
    }
    const isPasswordMatch = await bcrypt.compare(password, user.password)
    if (!isPasswordMatch) {
        throw new Error({ error: 'Login ou senha inválida' })
    }
    return user
}

const User = mongoose.model('User', userSchema)

module.exports = User