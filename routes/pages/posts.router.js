import express from "express";
import postsController from "../../controllers/posts.controller.js";
import upload from "../../config/upload.js";

const router = express.Router()

router.get('/', postsController.getPostsPage)
router.get('/new', (req, res) => {
    switch (req.query.type) {
        case "offers":
            res.locals.title = "Добавить предложение"
            res.locals.offer = true
            break
        case "vacancies":
            res.locals.title = "Добавить вакансию"
            res.locals.vacancy = true
            break
        case "services":
            res.locals.title = "Добавить услугу"
            res.locals.service = true
            break
        default:
            res.locals.title = "Добавить запись"
            res.locals.category = req.query.category
            res.locals.article = true
    }
    return res.render('pages/posts/new', res.locals)
})
router.get('/:postId', postsController.getPostPage)

router.post('/', upload, postsController.createPost)
router.post('/comments/:postId', postsController.addComments)


export default router;