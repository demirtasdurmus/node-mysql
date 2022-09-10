const router = require('express').Router()
const userController = require('./../controllers/userController')
const uploadSingleFile = require('../middleware/uploadSingleFile')
const resizeSingleImage = require('../middleware/resizeSingleImage')


router
    .get("/", userController.getMe)
    .post("/", userController.updateProfile)
    .post("/profile-images",
        uploadSingleFile("profileImage", "memory"),
        resizeSingleImage("profileImage", { width: 150, height: 150, quality: 100, format: "jpeg", dir: process.env.PROFILE_IMAGES_DIR }),
        userController.updateProfileImage)
    .patch("/", userController.updatePassword)

module.exports = router