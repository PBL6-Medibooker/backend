const User = require('./User')
const Speciality = require('./Speciality')

const bcrypt = require('bcrypt')
const validator = require('validator')
const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Doctor_Schema = new Schema({
    specialty_id: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Speciality', 
        required: false 
    },
    verified:{
        type: Boolean,
        default: false
    },
    working_hour: {
        type: String,
        default: 'undisclosed'
    },
    bio: {
        type: String,
        default: 'undisclosed'
    },
    region: {
        type: String,
        default: 'undisclosed'
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

const Doctor = User.discriminator('Doctor', Doctor_Schema)

module.exports = Doctor