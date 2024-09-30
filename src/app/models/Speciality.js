const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Speciality = new Schema({
    name: { 
        type: String, 
        required: true 
    },
    description: { 
        type: String 
    },
    speciality_image: {
        type: Buffer,
        default: null 
    },
    is_deleted: { 
        type: Boolean, 
        default: false 
    }
})

module.exports = mongoose.model('Speciality', Speciality)