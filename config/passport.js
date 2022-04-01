import passport from "passport";
import LocalStrategy from "passport-local";
import usersService from "../services/users.service.js";

passport.serializeUser((user, done) => done(null, user))
passport.deserializeUser((user, done) => done(null, user))

passport.use(
    new LocalStrategy(async (username, password, done) => {
        const user = await usersService.getUser(username);
        if ( user && user.validatePassword(password) ){
            return done(null, {id: user._id, username: user.username, isAdmin: user.isAdmin })
        } else if (!user) {
            return done(null, false, {message: 'User not found'})
        } else {
            return done(null, false, {message: 'Wrong password'})
        }
    })
)

export default passport