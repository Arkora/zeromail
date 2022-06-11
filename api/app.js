import express from "express";
import bodyParser from 'body-parser';
import Cors from 'cors'
import dotenv from 'dotenv'
import nodemailer from "nodemailer";
import multer from 'multer'
import path from 'path'
import fs from 'fs'


dotenv.config();

const app = express();
app.use(Cors());
app.use(bodyParser.json({ limit: '30mb', extended: true }))
app.use(bodyParser.urlencoded({ limit: '30mb', extended: true }))
app.use(express.static('./uploads'))

app.get('/',(req,res) =>{
    res.send("Easy Mail Api");
});

var storage = multer.diskStorage({
  destination: function(req, file, callback) {
      callback(null, "./uploads");
  },
  filename: function(req, file, callback) {      
      callback(null,  file.originalname);
  }
})
  
const upload = multer({ storage: storage })


  

app.post("/send",upload.array('files',3),(req,res) =>{
    const {email,subject,message} = req.body
    
    const attachments = req.files.map((file)=>{
      return { filename: file.filename, path: file.path };
    });  

    

    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      requireTLS: true,
      auth: {
        user: process.env.EMAIL,
        pass: process.env.PASS 
      }
    });

    const mailOptionsExtended = {
      from: process.env.EMAIL,
      to: email,
      subject: subject,
      text: message,
      attachments:attachments,
    }; 
    
    const mailOptions = {
      from: process.env.EMAIL,
      to: email,
      subject: subject,
      text: message,      
    };  



    

    if(req.files.length >=1){
      
      transporter.sendMail(mailOptionsExtended, (error, info) =>{
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
          fs.readdir('./uploads', (err, files) => {
            if (err) throw err;        
            for (const file of files) {
              fs.unlink(path.join('./uploads', file), err => {
                if (err) throw err;
              });
            }
          });
        }
      });
    
    }else{
      transporter.sendMail(mailOptions, (error, info) =>{
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response)          
        }
      })
    }   

     res.send("OK")

});

app.listen(process.env.PORT,() => { console.log("Server ON")})