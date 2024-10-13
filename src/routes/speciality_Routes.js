const speciality_Controller = require('../app/controllers/speciality_Controller')

const express = require('express')
const router = express.Router()

router.get('/get-speciality-list', speciality_Controller.get_Speciality_List)
router.post('/add-speciality', speciality_Controller.add_Speciality)
router.post('/update-speciality/:id', speciality_Controller.update_Speciality)
router.post('/soft-delete-speciality', speciality_Controller.soft_Delete_Specialty)
router.post('/delete-speciality', speciality_Controller.perma_Delete_Specialty)
router.post('/restore-speciality', speciality_Controller.restore_Deleted_Specialty)

module.exports = router