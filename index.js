// Importando o express
const { response } = require('express')
const { request } = require('express')
const express = require('express')
const uuid = require('uuid')
const cors = require('cors')

const port = 3001
const app = express()
app.use(express.json()) // Definindo o json com padrão
app.use(cors()) // Habilitando o cors para todas as rotas

const contacts = []

// Middlewares que vai checar o id do contato
const checkContactId = ( request, response, next) => {
    const { id } = request.params

    // Procurando o contato pela posição do array
    const index = contacts.findIndex(contact => contact.id === id)

    // Validando para contato não encontrado
    if(index < 0) {
        response.status(404).json({ error: 'Contact not found' })
    }

    request.contactIndex = index
    request.contactId = id

    next()
} 

// Rota que vai mostrar todos os contatos
app.get('/contacts', (request, response) => {
    return response.json(contacts)
})

// Rota para criar contatos
app.post('/contacts', (request, response) => {
    const { name, phone, email, address } = request.body

    const contact = { id:uuid.v4(), name, phone, email, address }

    // Adicionando o contato no array contacts
    contacts.push(contact)

    return response.status(201).json(contact)
})

// Rota para atualizar ou editar contato
app.put('/contacts/:id', checkContactId, (request, response) => {
    
    const { name, phone, email, address } = request.body

    const index = request.contactIndex
    const id = request.userId

    const updateContact = { id, name, phone, email, address }

    contacts[index] = updateContact

    return response.json(updateContact)
})

// Rota para deletar conatao
app.delete('/contacts/:id', checkContactId, (request, response) => {
    const index = request.contactIndex

    contacts.splice(index, 1)

    return response.status(204).json()
})

// Porta que a aplicação está rodando
app.listen(port, () => {
    console.log(`🚀 Server started on port ${port}`)
})