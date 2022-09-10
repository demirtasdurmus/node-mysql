const fs = require("fs")
const bcrypt = require("bcryptjs")
const AppError = require("../utils/appError")
const { User } = require('../models')


exports.getMe = async (userId) => {
    return await User.findByPk(userId, {
        attributes: ["id", "firstName", "lastName", "email", "profileImage", "createdAt"]
    })
}

exports.updateProfile = async (userId, data) => {
    const { firstName, lastName } = data
    const user = await User.findByPk(userId, {
        attributes: ["id", "firstName", "lastName"]
    })
    user.firstName = firstName
    user.lastName = lastName
    await user.save()
    return user
}

exports.updateProfileImage = async (req) => {
    const { userId, protocol, file } = req
    if (!file) throw new AppError(400, "Please upload an image!")
    const hostName = protocol + '://' + req.get('host')
    let profileImage = hostName + '/' + file.filepath
    const user = await User.findByPk(userId, { attributes: ["id", "profileImage"] })
    if (user.profileImage) {
        const oldPath = `./images/${user.profileImage.slice(hostName.length + 1)}`
        deleteFileIfExists(oldPath)
    }
    user.profileImage = profileImage
    await user.save()
    return user
}

exports.updatePassword = async (userId, data) => {
    const { oldPassword, password, passwordConfirm } = data
    // check if old password exists and is correct
    if (!oldPassword) throw new AppError(400, "Current password must be provided")
    const user = await User.findByPk(userId, { attributes: ["password"] });
    var passwordIsValid = bcrypt.compareSync(oldPassword, user.password);
    if (!passwordIsValid) throw new AppError(400, "Current password is incorrect")
    // check if password and passwordConfirm match
    if (password !== passwordConfirm) throw new AppError(400, "Passwords do not match")
    // check if old and new passwords are the same
    if (password === oldPassword) throw new AppError(400, "New password cannot be same as the old password")
    // update password
    await User.update(
        { password: bcrypt.hashSync(password, Number(process.env.PASSWORD_HASH_CYCLE)) },
        { where: { id: userId } }
    )
    return true
}

/*
UTILITY FUNCTIONS
*/
const deleteFileIfExists = (path) => {
    fs.access(path, function (err) {
        if (!err) {
            fs.unlink(path, (e) => { console.log(e) })
        }
    })
    return
}