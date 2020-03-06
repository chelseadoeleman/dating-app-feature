'use strict'

const bodyParser = require('body-parser')
const express = require('express')
const path = require('path')
const _ = require('lodash')
const cc = require('camelcase')
const { 
    handleErrorRoute,
    handleOverviewRoute,
    handleDetailRoute,
    handleLoginRoute,
    handleMatchesRoute,
    handleProfileRoute,
    setLogin,
    setLike
} = require('./helpers/helpers')
const app = express()

app.use(bodyParser.urlencoded({extended: true}))
app.use(express.static(path.join(__dirname, '../public')))

app.set('view engine', 'ejs')
app.set('views', `${__dirname}/views`)

app.post('/login', setLogin)
app.post('/setLike', setLike)

app.get('/', handleOverviewRoute)
app.get('/detail', handleDetailRoute)
app.get('/login', handleLoginRoute)
app.get('/matches', handleMatchesRoute)
app.get('/profile', handleProfileRoute)

// app.delete('/about:name', remove)

app.use(handleErrorRoute)


app.listen({ port: process.env.PORT || 8000 }), () => {
    console.log(`listening on port ${process.env.PORT || 5000}`)
}