const multer = require('multer');
const { CloudinaryStorage } = require("multer-storage-cloudinary")
var cloudinary = require('cloudinary').v2;
const dotenv = require('dotenv').config();

// configure cloudinary

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// create storage engine for multer

const storage = new CloudinaryStorage({
    cloudinary,
    allowedFormats: ['jpg', 'png', 'jpeg'],
    params: {
        folder: 'E_COM_USER_PROFILE'
    }
})

// init multer with storage engine

const uploadUserProfile = multer({
    storage
})

module.exports = { uploadUserProfile }