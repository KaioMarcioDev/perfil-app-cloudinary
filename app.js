require ('dotenv').config()

const express = require('express')
const path = require('path')
const multer  = require('multer')
const cloudinary = require('cloudinary').v2
const {CloudinaryStorage} = require('multer-storage-cloudinary')

//configurando a cloudinary com .env

cloudinary.config({
    cloud_name:process.env.CLOUD_NAME,
    api_key:process.env.API_KEY,
    api_secret:process.env.API_SECRET
})

// configura o armazenamento no cloudinary
const storage = new CloudinaryStorage({
    cloudinary,
    params:{
        folder:'perfis',
        format:'jpg',
        public_id:(req,file)=>{`perfil_${Date.now()}`}
    }
})

const upload = multer({storage})

const app = express()
const port = 3000

app.get('/',(req,res)=>{
    const absolutePath = path.join(__dirname, 'index.html'); // Obtém o caminho absoluto
    res.sendFile(absolutePath);
})

app.post('/upload', upload.single('image'),(req,res)=>{
    try {
        if(req.file){
            res.json({secure_url:req.file.path})
        }else{
            throw new Error('algo deu errado')
        }
    }catch(error){
        console.log(error)
        res.status(500).json({error:'erro ao fazer upload da imagem'})
    }
})

app.listen(port,()=>{
    console.log(`Servidor rodando em http:\\localhost:${port}`)
})