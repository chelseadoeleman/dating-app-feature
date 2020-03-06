const slug = require('slug')

const handleLoginRoute = (request, response) => {
    response.render('../views/login.ejs')
}

const handleDetailRoute = (request, response) => {
    response.render('../views/detail.ejs')
}

const handleOverviewRoute = (request, response) => {
    response.render('../views/index.ejs')
}

const handleMatchesRoute = (request, response) => {
    response.render('../views/matches.ejs')
}


const handleProfileRoute = (request, response) => {
    response.render('../views/profile.ejs')
}


const handleErrorRoute = (request, response, next) => {
    response.status(404).render('../views/404.ejs')
}

const setLogin = (request, response) => {
    response.status(304).redirect('/');
}

const setLike = (request, response) => {
    const { likeButton } = request.body
    console.log(likeButton)
    
    response.status(304).redirect('/');
}

// const handleAboutRoute = (request, response) => {
//     const { name } = request.query

//     try {
//         response.status(200).render('../views/about.ejs', 
//             (name) ? {
//                 name
//             } : {
//                 name: undefined
//             }
//         )

//     } catch (error) {
//         throw new Error(error)
//     }
// }


// const createName = (request, response) => {
//     const { name } = request.body
//     slug(name)

//     if(name) {
//         response.status(304).redirect(`/about?name=${name}`);
//     } else {
//         console.log('please enter your name')
//         response.status(409).redirect('/')
//     }

// }


module.exports = {
    handleErrorRoute,
    handleOverviewRoute,
    handleDetailRoute,
    handleLoginRoute,
    handleMatchesRoute,
    handleProfileRoute,
    setLogin,
    setLike
}