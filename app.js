const path = require("path")
const cookieParser = require('cookie-parser')
const cors = require('cors')
const express = require("express")
const helmet = require("helmet")
const morgan = require("morgan")

const api = require("./api")
const convertErrors = require('./middleware/convertErrors')
const handleErrors = require('./middleware/handleErrors')

const app = express()

app.use(cors())
app.use(morgan("dev"))

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static(path.join(__dirname, "images")))
app.use(cookieParser())

app.use(helmet({
    crossOriginResourcePolicy: false,
}))

// redirect incoming requests to api.js
app.use(`/api/${process.env.API_VERSION}`, api)

// set up a 404 handler
app.all("*", (req, res, next) => {
    res.status(404).end()
})

// convert&handle errors
app.use(convertErrors)
app.use(handleErrors)

module.exports = app