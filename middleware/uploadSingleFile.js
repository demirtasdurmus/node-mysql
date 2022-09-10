const multer = require('multer')
const { v4: uuidv4 } = require('uuid')
const slugify = require("slugify")
const AppError = require('../utils/appError')


module.exports = (name, storage, path) => {
    return (req, res, next) => {
        // create upload function with passed arguments(name and count)
        const upload = multer({
            storage: storage && storage === "memory" ? multer.memoryStorage() : storeOnDisk(path),
            fileFilter: fileFilter
        }).single(name);
        // call upload function immediately and return
        return upload(req, res, function (err) {
            if (err) {
                // handle file count limit error exclusively
                if (err.code === 'LIMIT_UNEXPECTED_FILE') {
                    return next(new AppError(400, 'Uploadable file limit exceeded!'));
                }
                // handle other errors
                return next(new AppError(400, err.message, err.name, true, err.stack));
            }
            // jump to next middleware if no error
            next()
        })
    }
}

/*
UTILITY FUNCTIONS
*/
const storeOnDisk = (path) => {
    return multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, path ? `images/${path}` : "images");
        },
        filename: (req, file, cb) => {
            const ext = file.mimetype.split('/')[1];
            let fileName;
            if (file.fieldname === "profileImage") {
                const userName = slugify(`${req.user.firstName} ${req.user.firstName}`, { lower: true })
                fileName = userName + "-" + uuidv4() + `.${ext}`
            } else {
                fileName = file.fieldname + "-" + uuidv4() + "-" + file.originalname.toLowerCase().split(' ').join('-') + `.${ext}`
            }
            cb(null, fileName)
        }
    })
}

const fileFilter = (req, file, cb) => {
    if (file.mimetype == "image/png" ||
        file.mimetype == "image/jpg" ||
        file.mimetype == "image/jpeg" ||
        file.mimetype == "image/webp") {
        cb(null, true);
    } else {
        cb(null, false);
        return cb(new AppError(400, 'Only .png, .jpg, .jpeg and webp format allowed!'));
    }
}