const User = require('./User')

const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Client = new Schema({
    user_id: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    insurance: { 
        type: String 
    }, 
    is_deleted: { 
        type: Boolean, default: false 
    }
})

module.exports = mongoose.model('Client', Client)