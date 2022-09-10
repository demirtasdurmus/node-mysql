const api = require("express").Router()
const isLoggedIn = require("./middleware/isLoggedIn")
const authRoutes = require("./routes/authRoutes")


api
    .use('/auth', authRoutes)

module.exports = api