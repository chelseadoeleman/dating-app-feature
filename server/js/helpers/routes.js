require('dotenv').config()
const slug = require('slug')
const mongo = require('mongodb')
const url = `mongodb+srv://chelseadoeleman:${process.env.DB_PASS}@cluster0-f7p2u.mongodb.net/test?retryWrites=true&w=majority`
let db = null
const userId = process.env.USER_ID

mongo.MongoClient.connect(url, {useNewUrlParser: true, useUnifiedTopology: true }, (error, client) => {
    try {
        db = client.db(process.env.DB_NAME)
        console.log(`Running on port ${process.env.PORT} connected to databse..`)
    } catch (error) {
        throw new Error(error)
    }
})

const handleLoginRoute = (request, response) => {
    response.render('../views/login.ejs')
}

const handleDetailRoute = (request, response, next) => {
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
    request.session.user = {_id: userId}
    const done = (error, data) => {
        if (error) {
            next(error)
        } else {            
            data.shift()
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

const getMatches = (request, response, next) => {
    if(request.session.user._id) {
        const getUserId = (error, data) => {
            if(error) {
                next(error)
            } else {
                const matches = data.matches
                request.session.user = {matches: matches}
                response.status(304).redirect('/matches')
            }
        }
        console.log(request.session.user._id)
        db.collection('dogs').findOne({_id: mongo.ObjectID(request.session.user._id)}, getUserId)
    } else {
        request.session.error = {title: 'Creditentials required'}
		response.status(401).redirect('/')
    }
}

const handleMatchesRoute = (request, response, next) => {
    const { matches } = request.session.user
    const done = (error, data) => {
        if (error) {
            next(error)
        } else {
            const dogs = data
            response.render('../views/matches.ejs', 
                (dogs) ? {
                    dogs: dogs 
                } :  {
                    dogs: undefined
                })
        }
    }

    const match = matches.map(dog => (mongo.ObjectID(dog)))
    db.collection('dogs').find({_id: {$in: match}}).toArray(done)
}
 
const handleErrorRoute = (request, response, next) => {
    response.status(404).render('../views/404.ejs')
}

const setLogin = (request, response) => {
    response.status(304).redirect('/')
}

const setLike = (request, response, next ) => {
    const { likeButton } = request.body

    if(request.session.user) {
        const getId = (error, data) => {
            if (error) {
                next(error)
            } else {
                if(likeButton === 'dislike') {
                    data.shift()
                    response.status(304).redirect('/')
                } else {
                    const done = (error, data) => {
                        if (error) {
                            next(error)
                        } else {
                            response.status(304).redirect('/')
                        }
                    }
                    db.collection('dogs').updateOne({_id: data._id}, {$addToSet: { matches: likeButton }}, done)
                }
            }
        }
        db.collection('dogs').findOne({_id: mongo.ObjectID(request.session.user._id)}, getId)
    } else {
        request.session.error = {title: 'Creditentials required'}
		response.status(401).redirect('/')
    }
}

module.exports = {
    handleErrorRoute,
    handleOverviewRoute,
    handleDetailRoute,
    handleLoginRoute,
    handleMatchesRoute,
    setLogin,
    setLike,
    getMatches
}