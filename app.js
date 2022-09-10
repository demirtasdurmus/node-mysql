const express = require("express")
const cors = require('cors')
const morgan = require("morgan")
const convertErrors = require('./middleware/convertErrors')
const handleErrors = require('./middleware/handleErrors')

const app = express()

app.use(cors())
app.use(morgan("dev"))

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// set up a 404 handler
app.all("*", (req, res, next) => {
    res.status(404).end()
})

// convert&handle errors
app.use(convertErrors)
app.use(handleErrors)

module.exports = app