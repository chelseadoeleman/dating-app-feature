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

const getMatches = (request, response, next) => {
    if(request.session.user._id) {
        const getUserId = (error, data) => {
            if(error) {
                next(error)
            } else {
                const matches = data.matches
                request.session.matches = {matches: matches}
                response.status(304).redirect('/matches')
            }
        }
        db.collection('dogs').findOne({_id: mongo.ObjectID(request.session.user._id)}, getUserId)
    } else {
        request.session.error = {title: 'Creditentials required'}
		response.status(401).redirect('/')
    }
}

const handleMatchesRoute = (request, response, next) => {
    const { matches } = request.session.matches

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

const handleProfileRoute = (request, response, next) => {
    console.log(request.session.user._id)

    if(request.session.user._id) {
        const getUserId = (error, data) => {
            if(error) {
                next(error)
            } else {
                response.render('../views/profile.ejs', 
                    (data) ? {
                        data: data 
                    } :  {
                        data: undefined
                    }
                )
            }
        }
        db.collection('dogs').findOne({_id: mongo.ObjectID(request.session.user._id)}, getUserId)
    } else {
        request.session.error = {title: 'Creditentials required'}
        response.status(401).redirect('/')
    }
}

const changeProfile = (request, response, next) => {
    const { name , age } = request.body 
    console.log(name, age)
    const change = (error, data) => {
        if (error) {
            next(error)
        } else {
            response.status(304).redirect('/profile')
        }
    }
    db.collection('dogs').updateOne({_id: mongo.ObjectID(request.session.user._id)}, {$set: { name: name, age: age }}, change)
}

const removeMatch = (request, response, next) => {
    const { remove } = request.body

    if(request.session.user) {
        const getId = (error, data) => {
            if (error) {
                next(error)
            } else {
                const removeItem = (error, data) => {
                    if (error) {
                        next(error)
                    } else {
                        response.status(304).redirect('/getMatches')
                    }
                }
                db.collection('dogs').updateOne({_id: data._id}, {$pull: { matches: remove }}, removeItem)
            }
        }
        db.collection('dogs').findOne({_id: mongo.ObjectID(request.session.user._id)}, getId)
    } else {
        request.session.error = {title: 'Creditentials required'}
		response.status(401).redirect('/')
    }

}

const handleErrorRoute = (request, response, next) => {
    response.status(404).render('../views/404.ejs')
}

module.exports = {
    handleErrorRoute,
    handleOverviewRoute,
    handleDetailRoute,
    handleProfileRoute,
    handleMatchesRoute,
    setLike,
    getMatches,
    removeMatch,
    changeProfile
}