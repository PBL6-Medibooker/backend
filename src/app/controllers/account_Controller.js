const User = require('../models/User')
const Doctor = require('../models/Doctor')
const Region = require('../models/Region')
const Speciality = require('../models/Speciality')

const multer = require('multer')
const { promisify } = require('util')
const jwt = require('jsonwebtoken')

require('dotenv').config()

const storage = multer.memoryStorage()

const upload_pdf = multer({
    storage: storage,
    fileFilter: (res, file, cb) =>{
        if(file.mimetype === 'application/pdf'){
            cb(null, true)
        }else{
            cb(new Error('Only PDF files are allowed'))
        }
    }
}).single('proof')

const upload_img = multer({
    storage: storage,
    fileFilter: (res, file, cb) =>{
        if(file.mimetype.startsWith('image/')){
            cb(null, true)
        }else{
            cb(new Error('Only image files are allowed'))
        }
    }
}).single('profile_image')

const upload_Promise_pdf = promisify(upload_pdf)
const upload_Promise_img = promisify(upload_img)

class user_Controller{
    create_Token = (_id) => {
        return jwt.sign({_id}, process.env.JWTSecret, {expiresIn: '1d'})
    }

    acc_Login = async(req, res) => {
        // get info from body
        const {email, password} = req.body
        console.log(req.headers['content-type'])
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

    acc_Signup = async(req, res) => {
        try{
            // wait for file upload
            await upload_Promise_pdf(req, res)
            
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
            res.status(201).json({email, token, role})

        }catch(error){ //if user account
            console.log(error.message)
            res.status(400).json({error: error.message})
        }
    }

    get_Account_List = async(req, res) =>{
        try{
            let accounts, query
            const {user, hidden_state, verified} = req.body

            query = { is_deleted: hidden_state }

            if (user === true) { 
                // Handle users

                query.__t = { $ne: "Doctor" }

                accounts = await User.find(query)
            } else { 
                // Handle doctors
                query = { is_deleted: hidden_state }
            
                if (verified !== undefined) {
                    query.verified = verified
                }
            
                accounts = await Doctor.find(query)
            }

            const accounts_With_Png_Images = accounts.map((account) => {
                const accountObject = account.toObject() // Convert Mongoose document to plain object

                if (accountObject.profile_image && Buffer.isBuffer(accountObject.profile_image)) {
                    // Convert buffer to base64 string
                    accountObject.profile_image = `data:image/png;base64,${accountObject.profile_image.toString('base64')}`
                }

                return accountObject
            })
            
            res.status(200).json(accounts_With_Png_Images)

        }catch(error){
            console.log(error.message)
            res.status(400).json({error: error.message})
        }
    }

    get_Account = async(req, res) =>{
        try{
            // get id
            const {email}= req.body

            let account = await User.findOne({email})
            
            const accountObject = account.toObject();

            // Convert profile image buffer to base64 if it exists
            if (accountObject.profile_image && Buffer.isBuffer(accountObject.profile_image)) {
                accountObject.profile_image = `data:image/png;base64,${accountObject.profile_image.toString('base64')}`
            }

            res.status(200).json(accountObject)

        }catch(error){
            console.log(error.message)
            res.status(400).json({error: error.message})
        }
    }

    update_Acc_Info = async(req, res) =>{
        try{
            // wait for file upload
            await upload_Promise_img(req, res)

            // get info from body
            const {username, phone, underlying_condition} = req.body
            const profile_image = req.file ? req.file.buffer : null

            // get id
            const account_Id = req.params.id

            // find account
            let account = await User.findById(account_Id)

            if(!account){
                return res.status(404).json({error: 'Account not found'})
            }

            // update
            if(username){
                account.username = username
            }
            if(phone){
                account.phone = phone
            }
            if(underlying_condition){
                account.underlying_condition = underlying_condition
            }
            if(profile_image){
                account.profile_image = profile_image
            }

            await account.save()

            res.status(200).json(account)

        }catch(error){
            console.log(error.message)
            res.status(400).json({error: error.message})
        }
    }

    soft_Delete_Account = async(req, res) =>{
        try{
            // get id list
            const {account_Ids} = req.body

            // if no ids
            if (!account_Ids || !Array.isArray(account_Ids) || account_Ids.length === 0) {
                return res.status(400).json({error: 'No IDs provided'});
            }

            // update
            const result = await User.updateMany(
                {_id: {$in: account_Ids}},
                {is_deleted: true}
            )

            res.status(200).json({
                message: 'Account soft deleted',
                modifiedCount: result.modifiedCount
            })

        }catch(error){
            console.log(error.message)
            res.status(400).json({error: error.message})
        }
    }

    restore_Deleted_Account = async(req, res) =>{
        try{
            // get id list
            const {account_Ids} = req.body

            // if no ids
            if (!account_Ids || !Array.isArray(account_Ids) || account_Ids.length === 0) {
                return res.status(400).json({error: 'No IDs provided'});
            }

            // update
            const result = await User.updateMany(
                {_id: {$in: account_Ids}},
                {is_deleted: false}
            )

            res.status(200).json({
                message: 'Account restored',
                modifiedCount: result.modifiedCount
            })

        }catch(error){
            console.log(error.message)
            res.status(400).json({error: error.message})
        }
    }

    perma_Delete_Account = async(req, res) =>{
        try{
            // get id list
            const {account_Ids} = req.body

            // if no ids
            if (!account_Ids || !Array.isArray(account_Ids) || account_Ids.length === 0) {
                return res.status(400).json({error: 'No IDs provided'});
            }

            // delete
            const result = await User.deleteMany(
                {_id: {$in: account_Ids}}
            )

            res.status(200).json({
                message: 'Account deleted',
                modifiedCount: result.modifiedCount
            })

        }catch(error){
            console.log(error.message)
            res.status(400).json({error: error.message})
        }
    }

    change_password = async(req, res) =>{
        try{
            // const {email} = req.user
            const {email, new_password} = req.body
            const user = await User.change_pass(email, new_password)
            
            console.log(user)
            res.status(200).json({email, user})

        }catch(error){
            console.log(error.message)
            res.status(400).json({error: error.message})
        }
    }

    update_Doctor_Info = async(req, res) =>{
        try{
            // get info from body
            const {speciality, region, bio} = req.body

            // get id
            const account_Id = req.params.id

            // find account
            let account = await Doctor.findById(account_Id)

            if(!account){
                return res.status(404).json({error: 'Account not found'})
            }

            // update
            if(speciality){
                const speciality_id = await Speciality.findOne({name: speciality }, {_id: 1})
                account.speciality_id = speciality_id._id
            }

            if(region){
                const region_id = await Region.findOne({name: region}, {_id: 1})
                account.region_id = region_id._id
            }

            if(bio){
                account.bio = bio
            }

            await account.save()
            
            res.status(200).json(account)
        }catch(error){
            console.log(error.message)
            res.status(400).json({error: error.message})
        }
    }

    upload_Doctor_Proof = async(req, res) =>{
        try{
            await upload_Promise_pdf(req, res)
            const proof = req.file ? req.file.buffer : null

            // get id
            const account_Id = req.params.id

            // update
            const account = await Doctor.findByIdAndUpdate(
                account_Id,
                {proof}, 
                {new: true})

            res.status(200).json(account)

        }catch(error){
            console.log(error.message)
            res.status(400).json({error: error.message})
        }
    }

    get_Doctor_Active_Hour_List = async(req, res) =>{
        try{
            // get id
            const account_Id = req.params.id

            // find doctor
            const doctor = await Doctor.findById(account_Id)

            res.status(201).json(doctor.active_hours)

        }catch(error){
            console.log(error.message)
            res.status(400).json({error: error.message})
        }
    }

    add_Doctor_Active_Hour = async(req, res) =>{
        try{
            const {day, start_time, end_time, hour_type} = req.body

            if(!day || !start_time || !end_time || !hour_type){
                throw new Error('Missing information')
            }

            // get id
            const account_Id = req.params.id

            // check overlap
            const new_Active_Hour = {day, start_time, end_time, hour_type}

            const is_overlap = await Doctor.Is_Time_Overlap(new_Active_Hour, account_Id)
            
            if(is_overlap){
                throw new Error('Overlapping time frame')
            }

            // add
            const doctor = await Doctor.findByIdAndUpdate(
                account_Id,
                {$push: {active_hours: new_Active_Hour}},
                {new: true}
            )

            res.status(201).json(doctor.active_hours)

        }catch(error){
            console.log(error.message)
            res.status(400).json({error: error.message})
        }
    }

    update_Doctor_Active_Hour = async(req, res) =>{
        try{
            const {
                day, start_time, end_time, hour_type, 
                old_day, old_start_time, old_end_time, old_hour_type
            } = req.body

            if(!day || !start_time || !end_time || !hour_type){
                throw new Error('Missing information')
            }

            // get id
            const account_Id = req.params.id

            // check overlap
            const excluded_time = {
                day: old_day, 
                start_time: old_start_time, 
                end_time: old_end_time, 
                hour_type: old_hour_type
            }
            const new_Active_Hour = {day, start_time, end_time, hour_type}

            const is_overlap = await Doctor.Is_Time_Overlap(new_Active_Hour, account_Id, excluded_time)
            
            if(is_overlap){
                throw new Error('Overlapping time frame')
            }

            // find doctor
            const doctor = await Doctor.findById(account_Id)

            // find old active hour
            const index = doctor.active_hours.findIndex(time_frame =>
                time_frame.day === old_day &&
                time_frame.start_time === old_start_time &&
                time_frame.end_time === old_end_time &&
                time_frame.hour_type === old_hour_type
            )

            // update
            doctor.active_hours[index] = new_Active_Hour

            await doctor.save()

            res.status(200).json({change: doctor.active_hours[index], 
                active_hours: doctor.active_hours})

        }catch(error){
            console.log(error.message)
            res.status(400).json({error: error.message})
        }
    }

    delete_Doctor_Active_Hour = async(req, res) =>{
        try{
            const {day, start_time, end_time, hour_type} = req.body

            if(!day || !start_time || !end_time || !hour_type){
                throw new Error('Missing information')
            }

            // get id
            const account_Id = req.params.id

            // find doctor
            const doctor = await Doctor.findById(account_Id)

            // find old active hour
            const index = doctor.active_hours.findIndex(time_frame =>
                time_frame.day === day &&
                time_frame.start_time === start_time &&
                time_frame.end_time === end_time &&
                time_frame.hour_type === hour_type
            )

            //delete
            doctor.active_hours.splice(index, 1)
            await doctor.save()

            res.status(200).json({message: 'Item deleted succesfully', 
                active_hours: doctor.active_hours})

        }catch(error){
            console.log(error.message)
            res.status(400).json({error: error.message})
        }
    }

    get_Filtered_Doctor_List = async(req, res) =>{
        try{
            const {speciality, region} = req.body

            let query = {}

            if(speciality){
                const speciality_id = await Speciality.findOne({name: speciality }, {_id: 1})
                query.speciality_id = speciality_id._id
            }

            if(region){
                const region_id = await Region.findOne({name: region}, {_id: 1})
                query.region_id = region_id._id
            }

            const doctors = await Doctor.find(query)

            res.status(200).json(doctors)
        }catch(error){
            console.log(error.message)
            res.status(400).json({error: error.message})
        }
    }

    change_Doctor_Verified_Status = async(req, res) =>{
        try{
            const {email, verified} = req.body

            const doctor = await Doctor.findOneAndUpdate(
                {email}, 
                {verified},
                {new: true}
            )

            res.status(200).json(doctor)
        }catch(error){
            console.log(error.message)
            res.status(400).json({error: error.message})
        }
    }

    change_Account_Role = async(req, res) =>{
        try{
            const {email, role} = req.body

            const account = await User.findOneAndUpdate(
                {email}, 
                {role},
                {new: true}
            )

            res.status(200).json(account)
        }catch(error){
            console.log(error.message)
            res.status(400).json({error: error.message})
        }
    }
    
}

module.exports = new user_Controller