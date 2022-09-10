const api = require("express").Router()
const isLoggedIn = require("./middleware/isLoggedIn")
const authRoutes = require("./routes/authRoutes")
const userRoutes = require("./routes/userRoutes")


api
    .use('/auth', authRoutes)
    .use('/users', isLoggedIn, userRoutes)

module.exports = api