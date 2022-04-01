import postsService from "../services/posts.service.js";

export default {
    getMainPage: async (req, res) => {
        res.locals.title = "Главная страница"
        res.locals.result = await postsService.getPostsData({type: "articles"})
        res.render('index', res.locals)
    },

    getMapPage: (req, res) => {
        res.locals.title = "Карты"
        return res.render('pages/map', res.locals)
    },

    getSupportPage: (req, res) => {
        res.locals.title = "О проекте"
        return res.render('support', res.locals)
    },

    getFAQPage: (req, res) => {
        res.locals.title = "Полезные ресурсы"
        return res.render('faq', res.locals)
    }
}