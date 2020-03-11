require('dotenv').config()
const slug = require('slug')
const mongo = require('mongodb')
const url = `mongodb+srv://chelseadoeleman:${process.env.DB_PASS}@cluster0-f7p2u.mongodb.net/test?retryWrites=true&w=majority`
let db = null

mongo.MongoClient.connect(url, {useNewUrlParser: true, useUnifiedTopology: true }, (error, client) => {
    try {
        db = client.db(process.env.DB_NAME)
        console.log('connected..')
    } catch (error) {
        throw new Error(error)
    }
})

const handleLoginRoute = (request, response) => {
    response.render('../views/login.ejs')
}

const handleDetailRoute = (request, response) => {
    const { id } = request.params
    const done = (error, data) => {
        if (error) {
            next(error)
        } else {
            response.render('../views/detail.ejs',
                (data) ? {
                    data: data 
                } :  {
                    data: undefined
                }
            )
        }
    }
    db.collection('dogs').findOne({_id: mongo.ObjectID(id)}, done)
}

const handleOverviewRoute = (request, response, next) => {

    const done = (error, data) => {
        if (error) {
            next(error)
        } else {
            response.render('../views/index.ejs', 
                (data) ? {
                    data: data 
                } :  {
                    data: undefined
                }
            )
        }
    }
    db.collection('dogs').find().toArray(done)
}

const handleMatchesRoute = (request, response) => {
    response.render('../views/matches.ejs')
}
 
const handleErrorRoute = (request, response, next) => {
    response.status(404).render('../views/404.ejs')
}

const setLogin = (request, response) => {
    response.status(304).redirect('/')
}

const setLike = (request, response) => {
    const { likeButton } = request.body
    console.log(likeButton)

    if(likeButton === 'dislike') {
        // Remove from overview
        response.status(304).redirect('/')
    } else {
        // Insert id into matches
        const done = (error, data) => {
            if (error) {
                next(error)
            } else {
                response.status(304).redirect('/')
            }
        }
        db.collection('dogs').insertOne({
            matches: likeButton
        }, done)
    }
}

module.exports = {
    handleErrorRoute,
    handleOverviewRoute,
    handleDetailRoute,
    handleLoginRoute,
    handleMatchesRoute,
    setLogin,
    setLike
}