const express = require('express')
const fileUpload = require('express-fileupload')
const mongodb = require('mongodb')
const fs = require('fs')

const app = express()
const router = express.Router()
const mongoClient = mongodb.MongoClient
const binary = mongodb.Binary

router.get("/", (req, res) => {
    res.sendFile('./index.html', { root: __dirname })
})

// router.get("/download", (req, res) => {
//     getFiles(res)
// })

app.use(fileUpload())

app.use(express.static('public'));

router.post("/", (req, res) => {
    let file = { 
        firstName: req.body.firstname,
        middleName:req.body.middlename,
        lastName:req.body.lastname,
        gender:req.body.gender,
        country:req.body.country,
        city:req.body.city,
        collegeName:req.body.collegename,
        year:req.body.year,
        phonenumber:req.body.phone,
        address:req.body.address,
        email:req.body.email,
        skill:req.body.skill,
        skill2:req.body.skill2,
        message:req.body.message,
        file: binary(req.files.uploadedFile.data)
         }
    //file: binary(req.files.uploadedFile.data)
    console.log('db');
    insertFile(file, res)
})

function insertFile(file, res) {
    mongoClient.connect('mongodb://localhost:27017', { useNewUrlParser: true }, (err, client) => {
        if (err) {
            return err
        }
        else {
            let db = client.db('uploadDB')
            let collection = db.collection('files')
            try {
                collection.insertOne(file)
                console.log('File Inserted')
            }
            catch (err) {
                console.log('Error while inserting:', err)
            }
            client.close()
            res.redirect('/')
        }

    })
}

// function getFiles(res) {
//     mongoClient.connect('mongodb://localhost:27017', { useNewUrlParser: true }, (err, client) => {
        
//         if (err) {
//             return err
//         }
//         else {
//             let db = client.db('uploadDB')
//             let collection = db.collection('files')
//             collection.find({}).toArray((err, doc) => {
//                 if (err) {
//                     console.log('err in finding doc:', err)
//                 }
//                 else {
//                     let buffer = doc[0].file.buffer
//                     fs.writeFileSync('uploadedImage.jpg', buffer)
//                 }
//             })
//             client.close()
//             res.redirect('/')
//         }

//     })
// }

app.use("/", router)

app.listen(3000, () => console.log('Started on 3000 port'))