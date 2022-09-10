const sharp = require('sharp')
const slugify = require("slugify")
const { v4: uuidv4 } = require('uuid')
const catchAsync = require('../utils/catchAsync')


module.exports = (name, { width = 500, height = 500, quality = 90, format = "jpeg", dir }) => {
    return catchAsync(async (req, res, next) => {
        if (!req.file) return next();
        //console.log("first,", req.file);
        let fileSlug = name
        if (name === "profileImage") fileSlug = slugify(`${req.user.firstName} ${req.user.lastName}`, { lower: true })

        req.file.filename = `${fileSlug}-${uuidv4()}.${format}`;
        req.file.filepath = `${dir}/${req.file.filename}`;

        await sharp(req.file.buffer)
            .resize(width, height)
            .toFormat(format)
            .jpeg({ quality })
            .toFile(`images/${dir}/${req.file.filename}`);
        next();
    })
}