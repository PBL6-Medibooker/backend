const User = require('./User')
const Speciality = require('./Speciality')
const Region = require('./Region')

const bcrypt = require('bcrypt')
const validator = require('validator')
const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Doctor_Schema = new Schema({
    speciality_id: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Speciality', 
        required: false 
    },
    verified:{
        type: Boolean,
        default: false
    },
    working_hours: [{
        day: String,
        start_time: String,
        end_time: String
    }],
    appointment_hours: [{
        day: String,
        start_time: String,
        end_time: String
    }],
    bio: {
        type: String,
        default: 'undisclosed'
    },
    region_id: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Region', 
        required: false 
    },
    proof: {
        type: Buffer,
        required: false
    }
})

Doctor_Schema.statics.add_Doctor = async function(email, password, username, phone, proof) {
    //validation
    if(!email || !password){
        throw Error('Email and password is required!')
    }
    
    if(!validator.isEmail(email)){
        throw Error('Invalid email!')
    }

    if(!validator.isStrongPassword(password)){
        throw Error('Password not strong enough!')
    }

    // if(!validator.isMobilePhone(phone, 'vi-VN')){
    //     throw Error('Invalid phone number!')
    // }

    const doc_exists = await this.findOne({email})
    const user_exists = await User.findOne({email})

    if(user_exists || doc_exists){
        throw Error('Email already in use!')
    }
    //hassing password
    const salt = await bcrypt.genSalt(10)
    const hass = await bcrypt.hash(password, salt)

    const doctor = await this.create({email, password: hass, username, phone, proof})

    return doctor
}

Doctor_Schema.statics.Is_Time_Overlap = async function(new_times, existing_times) {
    for(let new_time of new_times){
        
    }
}

const Doctor = User.discriminator('Doctor', Doctor_Schema)

module.exports = Doctor