'use strict'

require('dotenv').config()
const bodyParser = require('body-parser')
const express = require('express')
const path = require('path')
const _ = require('lodash')
const cc = require('camelcase')
const session = require('express-session')
const { 
    handleOverviewRoute,
    handleLoginRoute,
    handleMatchesRoute,
    setLogin,
    setLike,
    handleDetailRoute,
    handleErrorRoute
} = require('./helpers/routes')
const app = express()

app.use(session({
	resave: false,
	saveUninitialized: true,
	secret: process.env.SESSION_SECRET
}))

app.use(bodyParser.urlencoded({extended: true}))
app.use(express.static(path.join(__dirname, '../public')))

app.set('view engine', 'ejs')
app.set('views', `${__dirname}/views`)

app.post('/login', setLogin)
app.post('/setLike', setLike)

app.get('/', handleOverviewRoute)
app.get('/login', handleLoginRoute)
app.get('/matches', handleMatchesRoute)
app.get('/:id', handleDetailRoute)

app.use(handleErrorRoute)

app.listen({ port: process.env.PORT || 8000 }), () => {
    console.log(`listening on port ${process.env.PORT || 8000}`)
}