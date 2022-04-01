import postsService from "../services/posts.service.js"
import resize from '../config/resize.js'

export default {

    getPostPage: async function (req, res) {
        res.locals.result = await postsService.getPostData(req.params.postId)
        if (Object.keys(res.locals.result).length === 0) return res.render('404', res.locals)
        res.locals.title = res.locals.result.title
        return res.render('pages/posts/detail', res.locals)
    },

    getPostsPage: async function (req, res) {
        res.locals.title = "Все записи"
        switch (req.query.type) {
            case "offers":
                res.locals.type = "offers"
                break
            case "services":
                res.locals.type = "services"
                break
            case "vacancies":
                res.locals.type = "vacancies"
                break
            default:
                req.query.type = res.locals.type = "articles"
                res.locals.category = req.query.category
                res.locals.article = true
        }
        res.locals.result = await postsService.getPostsData({type: req.query.type})
        if (req.query.category) {
            res.locals.result = res.locals.result.filter(
                post => post.fields.some(field => field.name === "category" && field.value === req.query.category)
            )
        }
        return res.render('pages/posts', res.locals)
    },

    createPost: async function (req, res) {
        req.body.published = !!(req.user && req.user.isAdmin)
        // pics
        if (req.files['image']) {
            const mainPic = req.files['image'][0]
            req.body.image = {
                filename: mainPic.filename,
                path: mainPic.path.replace(/\\/g, "/")
            }
            await resize(mainPic.path)
        }

        if (req.files['gallery']) {
            const galPic = req.files['gallery']
            req.body.gallery = []
            galPic.forEach(pic => {
                req.body.gallery.push({
                    filename: pic.filename,
                    path: pic.path.replace(/\\/g, "/")
                })
                resize(pic.path)
            })
        }

        // type and fields
        req.body.type ? req.body.type : "undefined"
        req.body.fields = [
            {
                "name": "category",
                "value": req.body.category
            },
            {
                "name": "deal",
                "value": req.body.deal
            },
            {
                "name": "amount",
                "value": req.body.amount
            },
            {
                "name": "square",
                "value": req.body.square
            },
            {
                "name": "address",
                "value": req.body.address
            },
            {
                "name": "currency",
                "value": req.body.currency
            },
            {
                "name": "price",
                "value": req.body.price
            },
            {
                "name": "salary",
                "value": req.body.salary
            },
        ]
        const result = await postsService.createPost(req.body)
        return res.redirect(`/posts/${result.id}`)
    },

    addComments: async (req, res) => {
        await postsService.addComments(req.params.postId, {
            author: req.body.author,
            text: req.body.text
        })
        return res.redirect(`/posts/${req.params.postId}`)
    }
}

