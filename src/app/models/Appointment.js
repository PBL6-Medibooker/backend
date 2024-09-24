const Client = require('./Client')
const Doctor = require('./Doctor')

const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Appointment = Schema({
    client_id: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Client', 
        required: true 
    },
    doctor_id: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Doctor', 
        required: true 
    },
    appointment_date: { 
        type: Date, 
        required: true 
    },
    health_issue: { 
        type: String 
    },
    type_service: { 
        type: String 
    },
    is_deleted: { 
        type: Boolean, 
        default: false 
    }
})

module.exports = mongoose.model('Appointment', Appointment)