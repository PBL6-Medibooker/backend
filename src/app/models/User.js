const bcrypt = require('bcrypt')
const validator = require('validator')
const mongoose = require('mongoose')
const Schema = mongoose.Schema

const User = new Schema({
    email: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    username: {
        type: String
    },
    phone: {
        type: String
    },
    role: {
        type: String,
        required: true,
        default: 'user'
    },
    profile_image: { 
        type: Buffer,
        default: null
    },
    underlying_condition: {
        type: String,
        default: 'none' 
    },
    is_deleted: {
        type: Boolean,
        default: false
    }
}, { timestamps: true })

// sign up
User.statics.add_User = async function(email, password, username, phone) {
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

    const exists = await this.findOne({email})

    if(exists){
        throw Error('Email already in use!')
    }
    //hassing password
    const salt = await bcrypt.genSalt(10)
    const hass = await bcrypt.hash(password, salt)

    const user = await this.create({email, password: hass, username, phone})

    return user
}
// login method
User.statics.login = async function(email, password){
    //validation
    if(!email || !password){
        throw Error('No empty field!')
    }

    const user = await this.findOne({email})

    if(!user){
        throw Error('No user found')
    }

    const match = await bcrypt.compare(password, user.password)

    if(!match){
        throw Error('Invalid login')
    }

    return user
}
// change password
User.statics.change_pass = async function(email, password){

    const user = await this.findOne({email})

    // if(!validator.isStrongPassword(password)){
    //     throw Error("Password not strong enough!")
    // }

    const match = await bcrypt.compare(password, user.password)

    if(match){
        throw Error('New password must be different from the old one')
    }

    //hassing password
    const salt = await bcrypt.genSalt(10)
    const hass = await bcrypt.hash(password, salt)

    const updated_user = await this.findOneAndUpdate({email}, {password: hass}, {new: true})

    return updated_user
}

module.exports = mongoose.model('User', User)