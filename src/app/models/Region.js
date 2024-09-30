const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Region = new Schema({
    name: { 
        type: String, 
        required: true 
    },
    is_deleted: { 
        type: Boolean, 
        default: false 
    }
})

module.exports = mongoose.model('Region', Region)