import passport from "../config/passport.js";
import usersService from "../services/users.service.js";

export default {
    getLoginPage: (req, res) => {
        if (req.user) return res.redirect('/')
        res.locals.title  = "Войти"
        if ( req.session.flash && req.session.flash.error ) res.locals.flash = req.session.flash.error
        return res.render('pages/auth/login', res.locals)
    },

    getSignupPage: (req, res) => {
        if (req.user) return res.redirect('/')
        res.locals.title = "Зарегистрироваться"
        return res.render('pages/auth/signup', res.locals)
    },

    getLogoutPage: (req, res) => {
        if (!req.user) return res.redirect('/')
        else {
            req.logout()
        }
        return res.redirect('/')
    },

    authenticate: passport.authenticate('local', {
        successRedirect: '/',
        failureRedirect: '/auth/login',
        failureFlash: true,
    }),

    register: async function (req, res){
        const {username, password} = req.body
        const { _id } = await usersService.createUser(username, password)
        req.login({id: _id, username }, function(err) {
            if (err) return err
        });
        return res.redirect(`/`)
    }

}