const Appointment = require('../models/Appointment')

class appointment_Controller {
    add_Appointment = async(req, res) =>{
        try{
            const {
                client_id,
                doctor_id,
                appointment_day,
                appointment_time_start,
                appointment_time_end,
                health_issue,
                type_service
            } = req.body

            if(!client_id || !doctor_id 
                || !appointment_day 
                || !appointment_time_start 
                || !appointment_time_end
            ){
                throw new Error('Missing information')
            }

            const appointment = await Appointment.create({
                client_id,
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
}

module.exports = new appointment_Controller