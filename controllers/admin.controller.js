import usersService from "../services/users.service.js";
import postsService from "../services/posts.service.js";
import resize from "../config/resize.js";

export default {

    getMainPage: async function (req, res) {
        res.locals.title = "Админ"
        res.locals.result = await usersService.getUserData(req.user.username);
        return res.render('pages/admin', res.locals)
    },

    getUsersPage: async function (req, res) {
        res.locals.title = "Пользователи"
        res.locals.result = await usersService.getUsersData()
        return res.render('pages/admin/users', res.locals)
    },

    getUsersDetailPage: async function (req, res) {
        res.locals.title = "Подробнее о пользователе"
        res.locals.result = await usersService.getUserData(req.params.userId)
        return res.render('pages/admin/users/detail', res.locals)
    },

    updateUser: async function  (req, res) {
        if(!req.user || !req.user.isAdmin) return res.sendStatus(403)
        await usersService.updateUser(req.params.userId, req.body)
        return res.redirect(`/admin/users/${req.params.userId}`)
    },

    deleteUser: async function  (req, res) {
        if(!req.user || !req.user.isAdmin) return res.sendStatus(403)
        await usersService.deleteUser(req.params.userId)
        return res.redirect(`/admin/users`)
    },

    getPostsPage: async function  (req, res) {
        res.locals.title = "Записи"
        res.locals.result = await postsService.getPostsData()
        res.locals.result.forEach(el => el.category = el.fields.find(fld => fld.name === "category").value)
        return res.render('pages/admin/posts', res.locals)
    },

    getPostsDetailPage: async function  (req, res) {
        res.locals.title = "Детальная информация"
        res.locals.result = await postsService.getPostData(req.params.postId)
        if (Object.keys(res.locals.result).length === 0) return res.render('404', res.locals)
        res.locals.result.fields = res.locals.result.fields.filter(field => field.value);
        return res.render('pages/admin/posts/detail', res.locals)
    },

    updatePost: async function  (req, res) {
        if(!req.user || !req.user.isAdmin) return res.sendStatus(403)

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

        await postsService.updatePost(req.params.postId, req.body)
        return res.redirect(`/admin/posts/${req.params.postId}`)
    },

    deletePost: async function  (req, res) {
        if(!req.user || !req.user.isAdmin) return res.sendStatus(403)
        await postsService.deletePost(req.params.postId)
        return res.redirect(`/admin/posts/`)
    }

}
