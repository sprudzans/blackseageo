import express from 'express'
import session  from 'express-session'
import { engine } from 'express-handlebars'
import bodyParser from 'body-parser'
import MongoStore from 'connect-mongo'
import flash from 'connect-flash'
import dotenv from 'dotenv'
// my
import passport from './config/passport.js'
import routes from './routes/index.router.js'

// env & app
dotenv.config();
const app = express()

// static
app.use('/assets', express.static(`./assets`))

// body-parser
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

// express-session & connect-mongo
app.use(
    session({
        store: MongoStore.create({mongoUrl: process.env.MONGODB_URI}),
        proxy: true,
        cookie: { path: '/', httpOnly: true, secure: true, maxAge: 1000*60*60*24},
        secret: process.env.SESSION_SECRET,
        saveUninitialized: true,
        resave: false
    })
)

// Flash
app.use(flash())

app.get('/get-flash', (req, res) => {
    console.log('Flash: ', req.flash('message'))
    res.send('Get Flash')
})

app.get('/set-flash', (req, res) => {
    req.flash('message', { from: 'Me', to: 'You' })
    req.flash('warning', 'Important!')
    res.send('Set Flash')
})

// Handlebars
app.engine('hbs', engine({
    extname: 'hbs',
    helpers: {
        getDate: () => new Date().toString().slice(0, 21),
        getLineBreak: (text) => text.replace(/(\r\n|\n|\r)/gm, '<br>')
    }
}))

app.set('view engine', 'hbs')
app.set('views', './views')
app.enable('view cache')

// Passport
app.use(passport.initialize())
app.use(passport.session())

// Routes
app.use('/', routes)

// Worker
app.listen(process.env.PORT, () => console.log('Server was started on ' + process.env.HOST))