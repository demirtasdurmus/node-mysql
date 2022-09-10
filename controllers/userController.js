const catchAsync = require('../utils/catchAsync')
const userService = require("../services/userService")


exports.getMe = catchAsync(async (req, res, next) => {
    const data = await userService.getMe(req.userId)
    res.status(200).send({ status: "success", data })
})

exports.updateProfile = catchAsync(async (req, res, next) => {
    const data = await userService.updateProfile(req.userId, req.body)
    res.status(200).send({ status: "success", data })
})

exports.updateProfileImage = catchAsync(async (req, res, next) => {
    const data = await userService.updateProfileImage(req)
    res.status(200).send({ status: "success", data })
})

exports.updatePassword = catchAsync(async (req, res, next) => {
    await userService.updatePassword(req.userId, req.body)
    res.status(200).send({ status: "success", data: "" })
})