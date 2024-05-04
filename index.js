const express = require('express')
const app = express()
const path = require('path')
const multer = require('multer')

app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        //some logic has to be done
        cb(null, 'uploads/')
    },

    filename: function (req, file, cb) {
        cb(null, file.originalname + '_' + Date.now() + path.extname(file.originalname))
    }
})

let maxsize = 2 * 1000 * 1000
let upload = multer({
    storage: storage,
    limits: {
        fileSize: maxsize
    },

    fileFilter: function (req, file, cb) {
        let filetype = /jpg|jpeg|png/
        let mimetype = filetype.test(file.mimetype)
        console.log('this is mimetype ', mimetype);
        let extname = filetype.test(path.extname(file.originalname).toLowerCase())
        console.log('This is extname ', extname);
        if (mimetype && extname) {
            cb(null, true)
        } else {
            cb("Error!! only these files " + filetype + " are alowwed")
        }
    }
}).single("mypic")

app.get('/', (req, res) => {
    res.render('signup')
})


app.post('/upload', (req, res, next) => {
    upload(req, res, function (err) {
        if (err) {
            res.send(err)
        } else {
            res.send("File successfully uploaded!!")
        }
    })
})

app.listen(8080, () => {
    console.log('Server in running...');
})