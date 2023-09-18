import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { BadRequestError } from './errors/BadRequestError'

dotenv.config()

const app = express()

app.use(cors())
app.use(express.json())

app.listen(Number(process.env.PORT) || 3003, () => {
    console.log(`Servidor rodando na porta ${Number(process.env.PORT) || 3003}`)
})

app.get("/ping", (req, res) => {
    res.send("Pong!")
})

// Criar endpoint Sign up
// Receber os dados do postman através de um JSON 
// Verificar os dados com zodd
// Criar id do usuário com idgenerator
// Passar dados para userDatabase
// Devolver um token do usuário