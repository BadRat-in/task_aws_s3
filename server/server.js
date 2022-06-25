require("dotenv").config();
const express = require('express');
const app = express();
const cors = require('cors');
const { S3Client, ListObjectsCommand, GetObjectCommand, PutObjectCommand, DeleteObjectCommand, DeleteObjectsCommand } = require('@aws-sdk/client-s3');
const BodyParser = require('body-parser');
const multer = require('multer');

//These veriables are defined in .env file
//To access you aws s3 bucket goto .env file and put your details
const REGION = process.env.AWS_BUCKET_REGION; 
const BUCKET_NAME = process.env.AWS_BUCKET_NAME;
const ACCESS_KEY_ID = process.env.AWS_ACCESS_KEY_ID;
const SECRET_ACCESS_KEY = process.env.AWS_SECRET_ACCESS_KEY;
const upload = multer();
const client = new S3Client({
    region: REGION,
    accessKeyId: ACCESS_KEY_ID,
    secretAccessKey: SECRET_ACCESS_KEY
})

app.use(BodyParser.json());
app.use(BodyParser.urlencoded({ extended: true }));
app.use(BodyParser.text());
app.use(cors({
    origin: 'http://localhost:3000',
    // origin: '*',
}));



app.get('/', async (req, res) => {
    const params = {
        Bucket: BUCKET_NAME,
    };
    const data = await client.send(new ListObjectsCommand(params));
    return res.send(data.Contents);
});

app.post("/upload", upload.single("file"), async (req, res) => {
    if (req.file === null || req.file === undefined) {
        return res.status(403).send("file not found");
    }
    let file = req.file;
    const params = {
        Bucket: BUCKET_NAME,
        Key: file.originalname,
        Body: file.buffer,
        ContentType: file.mimetype,
        ACL: 'public-read'
    };
    client.send(new PutObjectCommand(params)).then(data => {
        if (data.status === 200) {
            const params = {
                UploadId: data.UploadId,
                Key: file.originalname,
                UploadState: 'Completed',
                size: file.size,
            };
            return res.status(201).send(params);
        }
    }
    ).catch(err => { console.log(err); return res.status(403).send("file upload failed"); });
});

app.listen(5000, () => { });
