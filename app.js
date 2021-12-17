const express = require('express')
const app = express()
const mongoose = require('mongoose')
const config = require('config')
const bodyParser = require('body-parser')

const authMiddleware = require('./middlewares/auth.middleware')

const start = async () => {
    const PORT = config.get('PORT') || 5000
    try {
        await mongoose.connect(config.get('mongoURI'))
        app.listen(PORT, () => {
            console.log(`Server is running on PORT ${PORT}...`)
        })
    }
    catch (e) {
        console.log(e)
    }
}

app.use('/static', express.static('static'))

app.use('/api/auth', require('./routes/auth.route'))

//пользователи;
app.use(
    '/api/users',
    bodyParser.json(),
    authMiddleware,
    require('./routes/users.route')
)

//категории;
app.use(
    '/api/categories',
    bodyParser.json(),
    authMiddleware,
    require('./routes/categories.route')
)

// товары;
app.use(
    '/api/goods',
    bodyParser.json(),
    authMiddleware,
    require('./routes/goods.routes')
)

// поля;
app.use(
    '/api/fields',
    bodyParser.json(),
    authMiddleware,
    require('./routes/fields.route')
)

start()