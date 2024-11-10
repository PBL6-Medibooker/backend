const Appointment = require('../models/Appointment')

class appointment_Controller {
    add_Appointment = async(req, res) =>{
        try{
            const {
                user_id,
                doctor_id,
                appointment_day,
                appointment_time_start,
                appointment_time_end,
                health_issue,
                type_service
            } = req.body

            if(!user_id || !doctor_id 
                || !appointment_day 
                || !appointment_time_start 
                || !appointment_time_end
            ){
                throw new Error('Missing information')
            }

            const appointment = await Appointment.create({
                user_id,
                doctor_id,
                appointment_day,
                appointment_time_start,
                appointment_time_end,
                health_issue,
                type_service
            })

            res.status(201).json(appointment)
        }catch(error){
            res.status(400).json({error: error.message})
        }
    }

    update_Appointment_Info = async(req, res) =>{
        try {
            const appointment_id = req.params.id
            const {health_issue, type_service} = req.body

            // Find and update the appointment
            const appointment = await Appointment.findByIdAndUpdate(
                appointment_id,
                {health_issue, type_service},
                {new: true})

            res.status(200).json(appointment)

        }catch(error){
            res.status(400).json({error: error.message})
        }
    }

    change_Appointment_Time = async(req, res) =>{
        try {
            const appointment_id = req.params.id
            const {appointment_day, appointment_time_start, appointment_time_end} = req.body

            if (!appointment_time_start || !appointment_time_end || !appointment_day) {
                throw new Error('Missing information')
            }

            const updatedAppointment = await Appointment.findByIdAndUpdate(
                appointment_id,
                {appointment_time_start, appointment_time_end},
                {new: true}
            )

            res.status(200).json(updatedAppointment)

        }catch(error){
            res.status(400).json({error: error.message})
        }
    }

    cancel_Appointment = async(req, res) =>{
        try {
            const appointment_id = req.params.id
            
            await Appointment.findByIdAndDelete(appointment_id)

            res.status(200).json({message: "Appointment is cancelled"})

        }catch(error){
            res.status(400).json({error: error.message})
        }
    }

    add_Insurance = async(req, res) =>{
        try{
            const appointment_id = req.params.id
            const {name, number, location, exp_date} = req.body

            const new_Insurance = {name, number, location, exp_date}

            const appointment = await Appointment.findByIdAndUpdate(
                appointment_id,
                {$push: {insurance: new_Insurance}},
                {new: true}
            )

            res.status(201).json(appointment.insurance)

        }catch(error){
            res.status(400).json({error: error.message})
        }
    }

    delete_Insurance = async(req, res) =>{
        try{
            const {appointment_id, insurance_id} = req.body

            const appointment = await Appointment.findById(appointment_id)

            appointment.insurance.pull({_id: insurance_id})

            await client.save()
            
            res.status(201).json(appointment.insurance)

        }catch(error){
            res.status(400).json({error: error.message})
        }
    }

    update_Insurance = async(req, res) =>{
        try {
            const {appointment_id, insurance_id, name, number, location, exp_date} = req.body

            const appointment = await Appointment.findById(appointment_id)

            const insurance = await Appointment.insurance.id(insurance_id)

            insurance.name = name
            insurance.number = number
            insurance.location = location
            insurance.exp_date = exp_date

            await appointment.save()
            
            res.status(200).json(appointment)
        }catch(error){
            res.status(400).json({error: error.message})
        }
    }

    get_All_Appointment = async(req, res) =>{
        try{
            const {is_deleted} = req.body
            let query = {}

            if(is_deleted !== undefined){
                query.is_deleted = is_deleted
            }

            const appointments = await Appointment.find(query)

            res.status(200).json(appointments)
        }catch(error){
            res.status(400).json({error: error.message})
        }
    }

    get_Appointment_By_User_Id = async(req, res) =>{
        try{
            const {is_deleted} = req.body
            const user_id = req.params.id

            let query = {user_id}

            if(is_deleted !== undefined){
                query.is_deleted = is_deleted
            }

            const appointment = await Appointment.findOne(query)

            res.status(200).json(appointment)

        }catch(error){
            res.status(400).json({error: error.message})
        }
    }

    get_Appointment_Insurance = async (req, res) => {
        try {
            const appointment_id = req.params.id
            
            const appointment = await Appointment.findById(appointment_id, 'insurance')
            
            res.status(200).json(appointment.insurance)
        }catch(error){
            res.status(400).json({error: error.message})
        }
    }

    soft_Delete_Appointment = async(req, res) =>{
        try{
            const appointment_id = req.params.id

            const appointment = await Appointment.findByIdAndUpdate(
                appointment_id,
                {is_deleted: true},
                {new: true}
            )

            res.status(200).json(appointment)

        }catch(error){
            res.status(400).json({error: error.message})
        }
    }

    restore_Appointment = async(req, res) =>{
        try{
            const appointment_id = req.params.id

            const appointment = await Appointment.findByIdAndUpdate(
                appointment_id,
                {is_deleted: false},
                {new: true}
            )

            res.status(200).json(appointment)
        }catch(error){
            res.status(400).json({error: error.message})
        }
    }
}

module.exports = new appointment_Controller