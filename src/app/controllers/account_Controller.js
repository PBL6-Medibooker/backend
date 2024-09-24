const User = require('../models/User')
const Doctor = require('../models/Doctor')

const multer = require('multer')
const { promisify } = require('util')
const jwt = require('jsonwebtoken')

require('dotenv').config()

const storage = multer.memoryStorage()

const upload = multer({
  storage: storage,
  fileFilter: (res, file, cb) =>{
    if(file.mimetype === 'application/pdf'){
      cb(null, true)
    }else{
      cb(new Error('Only PDF files are allowed'));
    }
  }
}).single('proof')

const uploadPromise = promisify(upload)

class user_Controller{
    create_Token = (_id) => {
        return jwt.sign({_id}, process.env.JWTSecret, {expiresIn: '1d'})
    }

    acc_Login = async(req, res) =>{
        // get info from body
        const {email, password} = req.body
        // get account
        try{
            let acc
            acc = await User.login(email, password)

            const token = this.create_Token(acc._id)
            const role = acc.role
            
            if(acc instanceof Doctor){
                const verified = acc.verified
                res.status(200).json({email, token, role, verified})
            }else{
                res.status(200).json({email, token, role})
            }
        }catch(error){
            console.log(error.message)
            res.status(400).json({error: error.message})
        }
    }

    acc_Signup = async(req, res) =>{
        try{
            // wait for file upload
            await uploadPromise(req, res)
            
            // get info from body
            const {email, password, username, phone, is_doc} = req.body
            const proof = req.file ? req.file.buffer : null
            const role = 'user'
            let acc
            
            // add account
            if(is_doc == '1'){ //if doctor account
                // console.log('doc')
                acc = await Doctor.add_Doctor(email, password, username, phone, proof)
            }else{
                // console.log('not doc')
                acc = await User.add_User(email, password, username, phone)
            }
            // console.log(acc)

            // create token and respone
            const token = this.create_Token(acc._id)
            res.status(200).json({email, token, role})

        }catch(error){ //if user account
            console.log(error.message)
            res.status(400).json({error: error.message})
        }
    }
}

module.exports = new user_Controller