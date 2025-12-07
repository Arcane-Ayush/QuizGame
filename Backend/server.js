// import express from 'express'

const express = require('express');
const app = express();

const path = require('path');
const PORT = 3000;

const FRONTEND_PATH = path.join(__dirname, '..', 'Frontend');
app.use(express.static(FRONTEND_PATH)); //__dirname is inbuilt node module 

const JSONS_PATH = path.join(__dirname, '..', 'JSONs');
app.use('/JSONs', express.static(JSONS_PATH));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'Frontend', 'index.html'));
})

app.listen(PORT, () => {
    console.log(`YAY!! server is running on port:${PORT}\n
http://localhost:3000`);
})
