const express = require('express')
const app = express()
const server = require('http').Server(app)
const { v4: uuidV4 } = require('uuid')
const { getModel } = require('./model')

app.set('view engine', 'ejs')
app.use(express.static('public'))
app.use('/models', express.static('models'))
app.use('/node_modules', express.static('node_modules'))

app.get('/', (req, res) => {
    res.render('index')
})

app.get('/u/:user', (req, res) => {
    getModel(req.params.user, function (resp) {
        res.render('user', {
            model: resp[0],
            texture: resp[1]
        })
    })
})

app.get('/m/:model', (req, res) => {
    res.render('model', { model: req.params.model })
})

app.get('/testing-three', (req, res) => {
    res.render('test')
})

server.listen(3000)