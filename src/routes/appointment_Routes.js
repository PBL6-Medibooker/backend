const appointment_Controller = require("../app/controllers/appointment_Controller");

const express = require('express')
const router = express.Router()

router.post('/add-appointment', appointment_Controller.add_Appointment)
router.post('/update-appointment-info/:id', appointment_Controller.update_Appointment_Info)
router.post('/update-appointment-date/:id', appointment_Controller.change_Appointment_Time)
router.post('/cancel-appointment/:id', appointment_Controller.cancel_Appointment)
router.post('/add-insurance/:id', appointment_Controller.add_Insurance)
router.post('/del-insurance', appointment_Controller.delete_Insurance)
router.post('/update-insurance', appointment_Controller.update_Insurance)
router.get('/get-all-client', appointment_Controller.get_All_Appointment)
router.get('/get-client-by-userid/:id', appointment_Controller.get_Appointment_By_User_Id)
router.get('/get-client-insr/:id', appointment_Controller.get_Appointment_Insurance)

module.exports = router