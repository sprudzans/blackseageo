import express from "express"
import authRouter from "./pages/auth.router.js"
import adminRouter from "./pages/admin.router.js"
import postsRouter from "./pages/posts.router.js"

import indexController from "../controllers/index.controller.js";

const router = express.Router()

router.use((req, res, next) => {
    if(req.user) {
        if(req.user.isAdmin){
            res.locals.debug = true
            res.locals.session = JSON.stringify(req.session, null, ' ')
        }
        res.locals.user =  req.user
    }
    next()
})

router.get('/', indexController.getMainPage)
router.get('/map', indexController.getMapPage)
router.get('/support', indexController.getSupportPage)
router.get('/faq', indexController.getFAQPage)

router.use('/auth', authRouter)
router.use('/posts', postsRouter)

router.use('/admin', (req, res, next) => {
    // TODO check req.user.id in db
    if (req.user && req.user.isAdmin) next()
    else res.redirect('/')
}, adminRouter);

// 404
router.use((req, res) => {
    res.locals.title = "Не найдено"
    res.render('404', res.locals)
})

export default router