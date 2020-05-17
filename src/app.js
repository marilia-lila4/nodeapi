const express = require('express') // import do express
const userRouter = require('./routers/user') // import do user
const port = process.env.PORT // procurar a conexão com o banco criado no Mongodb Atlas
require('./db/db') // conexão com o banco

const app = express()

app.use(express.json()) // arquivo JSON
app.use(userRouter)

//var user1 = express.json
//var user2 = userRouter

app.listen(port, () => {
    console.log(`Servido rodando na porta ${port}`)
})