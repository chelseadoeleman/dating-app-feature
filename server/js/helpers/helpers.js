const slug = require('slug')

const handleIndexRoute = (request, response) => {
    response.render('../views/index.ejs')
}

const handleAboutRoute = (request, response) => {
    const { name } = request.query
    console.log(name);
    try {
        response.status(200).render('../views/about.ejs', 
            (name) ? {
                name
            } : {
                name: undefined
            }
        )

    } catch (error) {
        throw new Error(error)
    }
}

const handleContactRoute = (request, response) => {
    response.render('../views/contact.ejs')
}

const handleErrorRoute = (request, response, next) => {
    response.status(404).render('../views/404.ejs')
}

const createName = (request, response) => {
    const { name } = request.body
    slug(name)

    if(name) {
        response.status(304).redirect(`/about?name=${name}`);
    } else {
        console.log('please enter your name')
        response.status(409).redirect('/')
    }

}

module.exports = {
    handleIndexRoute,
    handleErrorRoute,
    handleAboutRoute,
    handleContactRoute,
    createName
}