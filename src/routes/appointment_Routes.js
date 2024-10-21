const appointment_Controller = require("../app/controllers/appointment_Controller");

const express = require('express')
const router = express.Router()

router.post('/add-appointment', appointment_Controller.add_Appointment)
router.post('/update-appointment-info/:id', appointment_Controller.update_Appointment_Info)
router.post('/update-appointment-date/:id', appointment_Controller.change_Appointment_Time)
router.post('/cancel-appointment/:id', appointment_Controller.cancel_Appointment)

module.exports = router