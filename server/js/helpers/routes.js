require('dotenv').config()
const slug = require('slug')
const mongo = require('mongodb')
const url = `mongodb+srv://chelseadoeleman:${process.env.DB_PASS}@cluster0-f7p2u.mongodb.net/test?retryWrites=true&w=majority`
let db = null
const userId = process.env.USER_ID

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

const handleMatchesRoute = (request, response, next) => {
    const getUserId = (error, data) => {
        if(error) {
            next(error)
        } else {
            // const matches = data.matches
            // console.log('else statement')
            // matches.forEach(match => {
            //     console.log(match)
            // })
            response.render('../views/matches.ejs')
        }
    }
    console.log(request.session.user._id)
    db.collection('dogs').findOne({_id: mongo.ObjectID(request.session.user._id)}, getUserId)
}
 
const handleErrorRoute = (request, response, next) => {
    response.status(404).render('../views/404.ejs')
}

const setLogin = (request, response) => {
    response.status(304).redirect('/')
}

const setLike = (request, response, next ) => {
    const { likeButton } = request.body

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
                db.collection('dogs').updateOne({_id: data._id}, {$addToSet: { matches: likeButton }}, done, { upsert: true })
            }
        }
    }
    console.log(request.session.user._id)
    db.collection('dogs').findOne({_id: mongo.ObjectID(request.session.user._id)}, getId)
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