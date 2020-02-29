'use strict'

// const helmet = require('helmet')
const bodyParser = require('body-parser')
const express = require('express')
const path = require('path')
const _ = require('lodash')
const cc = require('camelcase')
const { 
    handleIndexRoute,
    handleErrorRoute,
    handleAboutRoute,
    handleContactRoute,
    createName
} = require('./helpers/helpers')
const app = express()

app.use(bodyParser.urlencoded({extended: true}))
app.use(express.static(path.join(__dirname, '../public')))

app.set('view engine', 'ejs')
app.set('views', `${__dirname}/views`)

app.get('/', handleIndexRoute)
app.get('/about', handleAboutRoute)
app.get('/contact', handleContactRoute)

app.post('/createName', createName)
app.use(handleErrorRoute)


app.listen({ port: process.env.PORT || 8000 }), () => {
    console.log(`listening on port ${process.env.PORT || 5000}`)
}